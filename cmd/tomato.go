package main

import (
	"errors"
	"flag"
	"fmt"
	"log"

	"github.com/donjaime/tomato"
)

func main() {
	tomatoIn := flag.String("tomatoIn", "views", "the folder to use as the tomato input root folder")
	tomatoOut := flag.String("tomatoOut", "gen/views.ts", "the output file to emit generated tomato views to")
	language := flag.String("language", "ts", "what language to use for the generated tomato views")
	viewBaseClass := flag.String("view", "View", "name of view base class")
	viewFactory := flag.String("factory", "createView", "function that instantiates a view")
	importLocation := flag.String("importLocation", "../ts/src/view", "where to find the view library")
	forceDebugIds := flag.Bool("debugIds", false, "whether or not to force generated Views to have debug-ids")

	flag.Parse()

	if err := tomato.GenerateTomatoes(*tomatoIn, *tomatoOut, getLanguage(*language), &tomato.GeneratorOptions{
		ViewBaseClass:  *viewBaseClass,
		ViewFactory:    *viewFactory,
		ImportLocation: *importLocation,
	}, *forceDebugIds); err != nil {
		fmt.Println(err.Error())
	}
}

func getLanguage(language string) tomato.Language {
	// TODO(jaime): support other languages
	if "ts" != language {
		log.Panic(errors.New("That language is currently not supported!"))
	}

	return tomato.TypeScript
}
