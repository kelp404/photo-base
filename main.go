package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
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
	content.JSON(http.StatusOK, gin.H{
		"src": "http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png",
	})
}
