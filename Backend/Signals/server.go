package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

// struct for signals matching the original JSON file
type Signal struct {
	Id      int64   `json:"signal_id"`
	Name    string  `json:"signal_name"`
	Elr     string  `json:"elr"`
	Mileage float32 `json:"mileage"`
}

// struct for unique signals, as the original JSON file has duplicate signals with different mileage on tracks
// this struct aggregates them in one entry with an array of mileages to be ready to use by the frontend ready parsed
type UniqueSignal struct {
	Id      int64     `json:"signal_id"`
	Name    string    `json:"signal_name"`
	Elr     string    `json:"elr"`
	Mileage []float32 `json:"mileage"`
}

// struct for tracks matching the original JSON file
type Track struct {
	Id      int64    `json:"track_id"`
	Source  string   `json:"source"`
	Target  string   `json:"target"`
	Signals []Signal `json:"signal_ids"`
}

// array of tracks as read from the JSON file, it is used by the endpoints functions
var tracks []Track

// The endpoint for GET /tracks/ without parameters, fetches all the track data without pagination
func getAllTracks(c *echo.Context) error {
	return c.JSON(http.StatusOK, tracks)
}

// The endpoint for GET /tracks/:id fetches the specified track data, including associated signals
func getTrack(c *echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var foundIndex int = -1
	for index := range tracks {
		if tracks[index].Id == int64(id) {

			foundIndex = index
			break
		}
	}
	// no track found
	if foundIndex == -1 {
		return c.JSON(http.StatusNotFound, "Track ID not found")
	}

	// sort the tracks by track ID
	sort.Slice(tracks[foundIndex].Signals[:], func(i, j int) bool {
		return tracks[foundIndex].Signals[i].Id < tracks[foundIndex].Signals[j].Id
	})

	return c.JSON(http.StatusOK, tracks[foundIndex])
}

// unused endpoint to return a signal from a specific track
func getSignal(c *echo.Context) error {
	track_id, _ := strconv.Atoi(c.Param("track_id"))
	signal_id, _ := strconv.Atoi(c.Param("signal_id"))

	var foundTrack int = -1
	for index := range tracks {
		if tracks[index].Id == int64(track_id) {
			foundTrack = index
			break
		}
	}

	var foundSignal int = -1
	for index := range tracks[foundTrack].Signals {
		if tracks[foundTrack].Signals[index].Id == int64(signal_id) {
			foundSignal = index
			break
		}
	}

	return c.JSON(http.StatusOK, tracks[foundTrack].Signals[foundSignal])
}

// The endpoint for GET /signals/ without parameters, fetches all the signals without pagination
func getAllSignals(c *echo.Context) error {
	var Signals = map[int64]*UniqueSignal{}

	// Iterate on all the tracks to store the UniqueSignals each with an array of mileages instead of duplicate signals that come from the original JSON
	for indexTracks := range tracks {
		for indexSignal := range tracks[indexTracks].Signals {

			_, exists := Signals[tracks[indexTracks].Signals[indexSignal].Id]
			if !exists {
				Signals[tracks[indexTracks].Signals[indexSignal].Id] = &UniqueSignal{}
				CurrentSignal := Signals[tracks[indexTracks].Signals[indexSignal].Id]
				CurrentSignal.Id = tracks[indexTracks].Signals[indexSignal].Id
				CurrentSignal.Name = tracks[indexTracks].Signals[indexSignal].Name
				CurrentSignal.Elr = tracks[indexTracks].Signals[indexSignal].Elr

				CurrentSignal.Mileage = append(CurrentSignal.Mileage, tracks[indexTracks].Signals[indexSignal].Mileage)
			}
			if exists {
				CurrentSignal := Signals[tracks[indexTracks].Signals[indexSignal].Id]
				CurrentSignal.Mileage = append(CurrentSignal.Mileage, tracks[indexTracks].Signals[indexSignal].Mileage)
			}

		}
	}
	// There is probably a more elegant way to do this, copying the map of signals into an array to return the JSON, I used this due to time.
	result := make([]UniqueSignal, 0, len(Signals))
	for _, signal := range Signals {
		result = append(result, *signal)
	}
	sort.Slice(result[:], func(i, j int) bool {
		return result[i].Id < result[j].Id
	})

	return c.JSON(http.StatusOK, result)
}

// enpoint to get all tracks associated with a signal, it is not used in the frontend yet
func getSignalTracks(c *echo.Context) error {
	signal_id, _ := strconv.Atoi(c.Param("id"))

	fmt.Println("Tracing getSignalTracks for ", signal_id)
	var signalTracks []Track

	for indexTracks := range tracks {
		for indexSignal := range tracks[indexTracks].Signals {
			fmt.Println("Iterate signal:", tracks[indexTracks].Id, " ", tracks[indexTracks].Signals[indexSignal].Id)
			if tracks[indexTracks].Signals[indexSignal].Id == int64(signal_id) {
				signalTracks = append(signalTracks, tracks[indexTracks])
				fmt.Println("Found track:", tracks[indexTracks].Id)
				break
			}
		}
	}
	sort.Slice(signalTracks[:], func(i, j int) bool {
		return signalTracks[i].Id < signalTracks[j].Id
	})
	return c.JSON(http.StatusOK, signalTracks)
}

// Load the orignal JSON file into tracks array
func loadJSONFile(fileName string) {

	jsonFile, err := os.Open(fileName)

	if err != nil {
		fmt.Println("Error reading file:", err)
		fmt.Println(err)
	}

	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	// Replace the NaN in the original
	var cleanedJson string = strings.Replace(string(byteValue), "NaN", "null", -1)

	err = json.Unmarshal([]byte(cleanedJson), &tracks)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return
	}
	sort.Slice(tracks[:], func(i, j int) bool {
		return tracks[i].Id < tracks[j].Id
	})
	fmt.Println("Tracks loaded ", tracks)
}

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
	}))

	loadJSONFile("crosstech-test-data.json")

	e.GET("/tracks/", getAllTracks)
	e.GET("/track/:id", getTrack)
	e.GET("/track/:track_id/signal/:signal_id", getSignal)
	e.GET("/signals/", getAllSignals)
	e.GET("/signaltracks/:id", getSignalTracks)

	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Welcome to the Signals App!")
	})

	if err := e.Start(":8080"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}

}
