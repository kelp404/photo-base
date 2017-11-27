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

	router.GET("/", func(content *gin.Context) {
		content.HTML(http.StatusOK, "base.html", gin.H{})
	})

	router.Run(":8080")
}
