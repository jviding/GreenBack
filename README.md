# GreenBack
GreenBack is an application for reading data from Arduino Uno and maintaining a database in Firebase.

# Requirements
-npm <br>
-node

# Usage
Ensure Arduino Uno is attached to your USB port. <br>
Go to the GreenBack directory. <br>
Run: $npm install <br>
Run: $node main.js <br>
<br>
Notice! <br> You may need to modify main.js file. <br>
On row 8 the serialPort address  "/dev/ttyACM0" may need to be switched. <br>
(In some cases "/dev/ttyACM1" might work for example...)

# How it works
GreenBack reads the outputs of Arduino Uno and maintains our database in Firebase. <br>
It pushes Digital Light and Loudness values to firebase every 2 minutes. The values pushed are the averages of values received from Arduino Uno over the 2 minutes of time. <br>
Air humidity and temperature are being pushed every 5 minutes and the values pushed are the averages of values received from Arduino Uno over that time. <br>
 <br>
To avoid flooding our Firebase with data, every time the day changes we perform a certain function. This function compresses all our data so that only averages for morning, day, evening and night are left. <br>
For example Loudness data for a certain day after performing the function would consist of only 4 nodes. Average of values for 0am-6am as night, 6am-12am as morning, 12am-6pm as day and 6pm-12pm as evening.
