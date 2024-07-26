package sigchan

import (
	"os"
	"os/signal"
	"syscall"
)

func MakeQuitSigChan() chan os.Signal {
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	return sig
}

func DoneOnQuitSig(done chan struct{}) {
	c := MakeQuitSigChan()
	go func() {
		<-c
		close(done)
	}()
}
