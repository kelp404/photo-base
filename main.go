package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	router := gin.Default()
	router.LoadHTMLFiles("./templates/base.html")

	router.GET("/", func(content *gin.Context) {
		content.HTML(http.StatusOK, "base.html", gin.H{})
	})

	router.Run(":8080")
}
