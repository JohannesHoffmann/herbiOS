#!/bin/bash
pkill -f omxplayer
nohup omxplayer -o alsa $1 &