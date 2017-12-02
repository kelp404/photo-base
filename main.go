package main

import (
	"github.com/gin-gonic/gin"
	"github.com/satori/go.uuid"
	"github.com/nfnt/resize"
	"net/http"
	"fmt"
	"os"
	"image"
	"image/jpeg"
)

func main() {
	router := gin.Default()
	router.Static("/node_modules", "./node_modules")
	router.StaticFile("/app.js", "./frontend/app.js")
	router.StaticFile("/templates/uploader.html", "./frontend/templates/uploader.html")
	router.LoadHTMLFiles("./frontend/templates/base.html")

	// base template
	router.GET("/", baseHandler)
	router.GET("/uploader", baseHandler)

	// /photos
	router.Static("/cache", "./files/cache")
	router.Static("/photos", "./files/photos")

	// API
	router.POST("/api/photos", uploadPhoto)
	router.POST("/api/_fetch", fetchRemotePhoto)

	router.Run(":8080")
}

func baseHandler(context *gin.Context) {
	context.HTML(http.StatusOK, "base.html", gin.H{})
}

func uploadPhoto(context *gin.Context) {
	file, _, err := context.Request.FormFile("file")
	if err != nil {
		context.String(http.StatusBadRequest, fmt.Sprintf("get form err: %s", err.Error()))
		return
	}
	filename := fmt.Sprintf("%s", uuid.NewV4())
	img, _, err := image.Decode(file)
	small := resize.Resize(200, 0, img, resize.Lanczos3)
	middle := resize.Resize(800, 0, img, resize.Lanczos3)
	large := resize.Resize(1200, 0, img, resize.Lanczos3)

	// write files
	smallOutput, _ := os.Create("./files/photos/" + filename + "-s.jpg")
	middleOutput, _ := os.Create("./files/photos/" + filename + "-m.jpg")
	largeOutput, _ := os.Create("./files/photos/" + filename + "-l.jpg")
	defer smallOutput.Close()
	defer middleOutput.Close()
	defer largeOutput.Close()
	jpeg.Encode(smallOutput, small, nil)
	jpeg.Encode(middleOutput, middle, nil)
	jpeg.Encode(largeOutput, large, nil)

	context.JSON(http.StatusOK, gin.H{
		"small":  "/photos/" + filename + "-s.jpg",
		"middle": "/photos/" + filename + "-m.jpg",
		"large":  "/photos/" + filename + "-l.jpg",
	})
}

type FetchRemotePhotoForm struct {
	URL string `json:"url" binding:"required"`
}
func fetchRemotePhoto(context *gin.Context) {
	var json FetchRemotePhotoForm
	context.BindJSON(&json)
	response, _ := http.Get(json.URL)
	img, _, _ := image.Decode(response.Body)
	filename := fmt.Sprintf("%s", uuid.NewV4())
	output, _ := os.Create("./files/cache/" + filename + ".jpg")
	defer output.Close()
	jpeg.Encode(output, img, nil)

	context.JSON(http.StatusOK, gin.H{
		"url": "/cache/" + filename + ".jpg",
	})
}
