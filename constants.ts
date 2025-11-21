export const SPIKE_PRIME_DOCS = `
Python
Getting Started
Introduction to Python
Python is a popular text-based coding language that is excellent for beginners because it’s concise and easy-to-read.
This Getting Started section introduces the basics of using Python with LEGO® Education SPIKE™ Prime.
Introduction to Python
1. Learn to use the Code Editor in the LEGO® Education SPIKE™ App to write Python code.
Hello, World!
2. Write a message on the Light Matrix of the SPIKE Prime Hub.
Comments in Python
3. Learn how comments can help you describe draft and finished programs.
Controlling Motors
4. Define and start asynchronous functions to control motors.
Variables
5. Control two motors with local and global variables.
The Power of Random
6. Discover ways to create fun and unpredictable programs that control the light on the Hub.
Sensor Control
7. Control a motor using the Force Sensor. Then learn ways to use the Console to debug your program.
Sensor Conditions
8. Use logical expressions to react to different conditions. Then learn to run different parts of your code together to react to multiple conditions.
Next Steps
9. Get suggestions for additional resources to learn more about using Python with SPIKE Prime.
Python Syntax
In Python, each statement begins with a level of indentation and ends with a line break. Indentation is the number of spaces before a statement. The SPIKE App uses 4 spaces for each indentation level.
# This is a comment.
print('LEGO')
if True:
    print(123)
SPIKE Prime Modules
To control the SPIKE Prime Hub, sensors, and motors, you’ll need the SPIKE Prime modules. 
import motor
MicroPython
The Hub runs MicroPython, a highly optimized version of the Python language.
Decimals use the unoptimized float type, so the SPIKE Prime modules avoid this data type. Use milliseconds (500) instead of seconds (0.5).

Hello, World!
from hub import light_matrix
light_matrix.write('Hello, World!')

Define a Function
from hub import light_matrix
def hello():
    light_matrix.write('Hello, World!')
hello()

Controlling Motors
import motor
from hub import port
# Run a motor on port A for 360 degrees at 720 degrees per second.
motor.run_for_degrees(port.A, 360, 720)

Multiple Motors (Async/Await)
import motor
import runloop
from hub import port
async def main():
    # Run two motors on ports A and B for 360 degrees at 720 degrees per second.
    # The motors run after each other.
    await motor.run_for_degrees(port.A, 360, 720)
    await motor.run_for_degrees(port.B, 360, 720)
runloop.run(main())

Sensor Control
import force_sensor
import motor
from hub import port
while True:
    force = force_sensor.force(port.B)
    motor.run(port.A, force)

Sensor Conditions
from hub import port, sound
import color
import color_sensor
import runloop
async def main():
    while True:
        # Check if the red color is detected.
        if color_sensor.color(port.A) == color.RED:
            sound.beep(440, 1000000, 100)
            while color_sensor.color(port.A) == color.RED:
                await runloop.sleep_ms(1)
            sound.stop()
runloop.run(main())

Multiple Conditions (Concurrent Coroutines)
from hub import button, port, sound
import color
import color_sensor
import runloop

def red_detected():
    return color_sensor.color(port.A) == color.RED

def left_pressed():
    return button.pressed(button.LEFT) > 0

async def check_color():
    while True:
        while not red_detected():
            await runloop.sleep_ms(1)
        sound.beep(440, 1000000, 100)
        while red_detected():
            await runloop.sleep_ms(1)
        sound.stop()

async def check_button():
    while True:
        while not left_pressed():
            await runloop.sleep_ms(1)
        sound.beep(880, 200, 100)
        while left_pressed():
            await runloop.sleep_ms(1)

runloop.run(check_color(), check_button())

API MODULES REFERENCE

App Module: import app (bargraph, display, linegraph, music, sound)

Color Module: import color
Constants: BLACK, MAGENTA, PURPLE, BLUE, AZURE, TURQUOISE, GREEN, YELLOW, ORANGE, RED, WHITE, UNKNOWN.

Color Matrix: import color_matrix
Functions: clear(port), get_pixel(port, x, y), set_pixel(port, x, y, pixel), show(port, pixels).

Color Sensor: import color_sensor
Functions: color(port), reflection(port), rgbi(port).

Device: import device
Functions: data(port), id(port), get_duty_cycle(port), ready(port), set_duty_cycle(port, duty_cycle).

Distance Sensor: import distance_sensor
Functions: clear(port), distance(port) -> int (mm), get_pixel(port, x, y), set_pixel(port, x, y, intensity), show(port, pixels).

Force Sensor: import force_sensor
Functions: force(port) -> int (decinewton 0-100), pressed(port) -> bool, raw(port).

Hub Module: from hub import ...
- button: pressed(button) -> int. Constants: LEFT, RIGHT.
- light: color(light, color). Constants: POWER, CONNECT.
- light_matrix: clear(), get_orientation(), get_pixel(x,y), set_orientation(top), set_pixel(x,y,intensity), show(pixels), show_image(image), write(text).
- motion_sensor: acceleration(raw), angular_velocity(raw), gesture(), get_yaw_face(), quaternion(), reset_tap_count(), reset_yaw(angle), set_yaw_face(up), stable(), tap_count(), tilt_angles(), up_face().
- port: Constants A, B, C, D, E, F.
- sound: beep(freq, duration...), stop(), volume(vol).

Motor Module: import motor
Functions:
- absolute_position(port)
- relative_position(port)
- reset_relative_position(port, position)
- run(port, velocity, acceleration=1000)
- run_for_degrees(port, degrees, velocity, stop=BRAKE, ...) -> Awaitable
- run_for_time(port, duration, velocity, stop=BRAKE, ...) -> Awaitable
- run_to_absolute_position(port, position, velocity, direction=SHORTEST_PATH, ...) -> Awaitable
- run_to_relative_position(port, position, velocity, ...) -> Awaitable
- stop(port, stop=BRAKE)
- velocity(port)
Constants: READY, RUNNING, STALLED, CANCELLED, ERROR, DISCONNECTED, COAST, BRAKE, HOLD, CONTINUE, SMART_COAST, SMART_BRAKE, CLOCKWISE, COUNTERCLOCKWISE, SHORTEST_PATH, LONGEST_PATH.

Motor Pair Module: import motor_pair
Functions:
- pair(pair_id, left_port, right_port)
- move(pair, steering, velocity=360, ...)
- move_for_degrees(pair, degrees, steering, velocity=360, ...) -> Awaitable
- move_for_time(pair, duration, steering, velocity=360, ...) -> Awaitable
- move_tank(pair, left_vel, right_vel, ...)
- move_tank_for_degrees(pair, degrees, left_vel, right_vel, ...) -> Awaitable
- move_tank_for_time(pair, left_vel, right_vel, duration, ...) -> Awaitable
- stop(pair)
- unpair(pair)
Constants: PAIR_1, PAIR_2, PAIR_3.

Orientation Module: import orientation
Constants: UP, RIGHT, DOWN, LEFT.

Runloop Module: import runloop
Functions: 
- run(*functions)
- sleep_ms(duration) -> Awaitable
- until(function, timeout) -> Awaitable
`;
