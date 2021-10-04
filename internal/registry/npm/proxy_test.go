package npm

import (
	"net/http"
	"os"
	"os/exec"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/valist-io/valist/internal/core/mock"
)

func TestNpmProxy(t *testing.T) {
	tmp, err := os.MkdirTemp("", "test")
	require.NoError(t, err, "Failed to create temp dir")
	defer os.RemoveAll(tmp)

	client, _, err := mock.NewClient(tmp)
	require.NoError(t, err, "Failed to create mock client")

	registryAddr := "localhost:10006"
	registryPath := "http://localhost:10006"

	go func() {
		err := http.ListenAndServe(registryAddr, NewProxy(client, tmp))
		require.NoError(t, err, "Failed to start http server")
	}()

	cmd := exec.Command("npm", "init", "-y")
	cmd.Dir = tmp

	out, err := cmd.CombinedOutput()
	require.NoError(t, err, "Failed to init npm package: %s", out)

	cmd = exec.Command("npm", "install", "react", "--registry", registryPath)
	cmd.Dir = tmp

	out, err = cmd.CombinedOutput()
	require.NoError(t, err, "Failed to install npm package: %s", out)
}
