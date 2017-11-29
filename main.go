package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	router := gin.Default()
	router.Static("/node_modules", "./node_modules")
	router.StaticFile("/app.js", "./frontend/app.js")
	router.LoadHTMLFiles("./frontend/templates/base.html")

	router.GET("/", baseHandler)
	router.GET("/uploader", baseHandler)

	// API
	router.GET("/api/photos", getPhotos)

	router.Run(":8080")
}

func baseHandler(content *gin.Context) {
	content.HTML(http.StatusOK, "base.html", gin.H{})
}

func getPhotos(content *gin.Context) {
	content.JSON(http.StatusOK, []string{"lena", "austin", "foo"})
}
