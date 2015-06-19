# GreenBack
GreenBack is a Node.js application for reading data from our Arduino Uno
and maintaining our database in Firebase.

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
