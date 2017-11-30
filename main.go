package main

import (
	"github.com/gin-gonic/gin"
	"github.com/satori/go.uuid"
	"net/http"
	"fmt"
	"os"
	"io"
)

func main() {
	router := gin.Default()
	router.Static("/node_modules", "./node_modules")
	router.StaticFile("/app.js", "./frontend/app.js")
	router.StaticFile("/templates/uploader.html", "./frontend/templates/uploader.html")
	router.LoadHTMLFiles("./frontend/templates/base.html")

	router.GET("/", baseHandler)
	router.GET("/uploader", baseHandler)

	// API
	router.GET("/api/photos", getPhotos)
	router.POST("/api/photos", uploadPhoto)

	router.Run(":8080")
}

func baseHandler(content *gin.Context) {
	content.HTML(http.StatusOK, "base.html", gin.H{})
}

func getPhotos(content *gin.Context) {
	content.JSON(http.StatusOK, []string{"lena", "austin", "foo"})
}

func uploadPhoto(content *gin.Context) {
	file, _, err := content.Request.FormFile("file")
	if err != nil {
		content.String(http.StatusBadRequest, fmt.Sprintf("get form err: %s", err.Error()))
		return
	}
	filename := fmt.Sprintf("%s", uuid.NewV4())
	out, err := os.Create("./files/photos/"+filename)
	if err != nil {
		content.String(http.StatusInternalServerError, fmt.Sprintf("get form err: %s", err.Error()))
		return
	}
	defer out.Close()
	io.Copy(out, file)

	content.JSON(http.StatusOK, []string{"lena", "austin", "foo"})
}
