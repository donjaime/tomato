package tomato

import (
	"bytes"
	"container/list"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

const (
	tomatoFileExtension = ".htmto"
)

func GenerateTomatoes(viewDir string, outFile string, language Language, opts *GeneratorOptions, forceDebugIds bool) error {
	files, err := collectTomatoFiles(viewDir)
	if err != nil {
		return err
	}

	generator, err := MakeTomatoGenerator(language, opts)
	if err != nil {
		return err
	}

	// Now that we have the tomato file paths. Go ahead and generate the view strings.
	views, err := generator.GenerateViews(files, forceDebugIds)
	if err != nil {
		return err
	}

	// Write the file to disk.
	if err := writeTomatoOutput(outFile, views, generator); err != nil {
		return err
	}

	return nil
}

func collectTomatoFiles(root string) (*list.List, error) {
	l := list.New()
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		} else if !info.IsDir() && strings.HasSuffix(info.Name(), tomatoFileExtension) {
			l.PushBack(path)
		}
		return nil
	})

	if err != nil {
		return nil, err
	} else {
		return l, nil
	}
}

// Write the generated views to a file. This file should never ever be more than
// on the order of a few thousand lines, so it lives all in memory.
func writeTomatoOutput(outFile string, views map[string]*View, generator TomatoGenerator) error {
	viewText := &bytes.Buffer{}
	cssText := &bytes.Buffer{}

	generator.EmitPreamble(viewText)

	// Ensure a stable sort order based on filename
	keys := make([]string, len(views))
	i := 0
	for k, _ := range views {
		keys[i] = k
		i++
	}
	sort.Strings(keys)

	for _, key := range keys {
		content := views[key]
		viewText.WriteString(content.ViewText)
		viewText.WriteString("\n\n")

		if content.CssText != "" {
			cssText.WriteString(content.CssText)
			cssText.WriteString("\n\n")
		}
	}
	generator.EmitPostamble(viewText)

	// Dump the file to disk.
	if err := os.MkdirAll(filepath.Dir(outFile), 0777); err != nil {
		return err
	}

	// Dump an associated Css file.
	css := cssText.String()
	cssOutFile := string(outFile[:strings.LastIndex(outFile, ".")]) + ".scss"
	if err := ioutil.WriteFile(cssOutFile, []byte(css), 0644); err != nil {
		return err
	}

	return ioutil.WriteFile(outFile, viewText.Bytes(), 0644)
}
