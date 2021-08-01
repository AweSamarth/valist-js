package build

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

type DockerConfig struct {
	Path           string
	BaseImage      string
	Source         string
	BuildCommand   string
	InstallCommand string
}

func GenerateDockerfile(dockerConfig DockerConfig) {
	var dockerfile = fmt.Sprintf(
		"FROM %s\nWORKDIR /opt/build\nCOPY %s ./",
		dockerConfig.BaseImage, dockerConfig.Source,
	)

	if dockerConfig.BuildCommand != "" {
		dockerfile += fmt.Sprintf("\nRUN %s", dockerConfig.BuildCommand)
	}

	if dockerConfig.InstallCommand != "" {
		dockerfile += fmt.Sprintf("\nRUN %s", dockerConfig.InstallCommand)
	}

	os.WriteFile(dockerConfig.Path, []byte(dockerfile), 0644)
}

func Create(imageTag string) error {
	cmd := exec.Command("docker", "build", ".", "-t", imageTag, "--progress=plain")
	cmd.Env = os.Environ()
	cmd.Env = append(cmd.Env, "DOCKER_BUILDKIT=1")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()

	return nil
}

func Export(image string, out string) error {
	cwd, err := os.Getwd()
	if err != nil {
		return err
	}
	hostPath := filepath.Join(cwd, out)
	containerPath := fmt.Sprintf("valist-build:/opt/build/%s", out)

	// fmt.Println(hostPath)
	// fmt.Println(containerPath)

	// If output is a single directory, remove the directory
	if _, err := os.Stat(hostPath); !os.IsNotExist(err) {
		err := os.Remove(hostPath)
		if err != nil {
			return err
		}
	}

	createCmd := exec.Command("docker", "create", "--name=valist-build", "valist-build")
	createCmd.Stdout = os.Stdout
	createCmd.Stderr = os.Stderr
	err = createCmd.Run()
	if err != nil {
		return err
	}

	cpCmd := exec.Command("docker", "cp", containerPath, hostPath)
	cpCmd.Stdout = os.Stdout
	cpCmd.Stderr = os.Stderr

	cpCmd.Run()
	if err != nil {
		return err
	}

	rmCmd := exec.Command("docker", "rm", "valist-build")
	rmCmd.Stdout = os.Stdout
	rmCmd.Stderr = os.Stderr
	rmCmd.Run()
	if err != nil {
		return err
	}
	return nil
}
