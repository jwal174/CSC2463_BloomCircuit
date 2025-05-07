# CSC2463_BloomCircuit
# Project Outline
Bloom Circuit is an interactive, time-limited game where players control a robot gardener, BloomBot, tasked with restoring life to a barren, broken world using a joystick and buttons wired through an Arduino Uno. You are BloomBot, an old maintenance droid who has awakened to restore the Earth. Till the soil, plant seeds, and fix solar panels to revive the environment. The game blends physical hardware with visuals and ambient sound to explore themes of restoration, care, and environmental healing.

# Core Mechanics

Three tools: Soil (till ground), Plant (grow greenery), Fix (repair tech).


Joystick movement via Arduino input (mapped to X/Y).


Button1 to interact with tiles (e.g. tilling, planting, fixing).


Button2 to cycle tools.


Tile types: dirt, stone, plants, broken/fixed solar panels.


LED feedback reflects tool selection:


Red = Soil


Green = Plant


Blue = Fix


One-minute gameplay session, with a visual countdown and ending message.


Ambient sounds and nature loops create an immersive environment.

# Technical Overview

p5.js (JavaScript)

Reads serial data from Arduino.


Renders the tile grid and robot.


Controls sound, visuals, and gameplay state.


Arduino

Sends joystick (X, Y) and button states to p5.js.


Receives LED color signals based on selected tool.

# Future Development Ideas
Add growth stages for plants over time.


Make tile states evolve passively or decay if neglected.


Smarter environmental response to actions.


Post-game stats screen showing what the player restored.


Adaptive soundtrack that evolves based on restoration level.
