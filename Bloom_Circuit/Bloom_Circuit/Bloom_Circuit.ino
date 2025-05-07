const int xPin = A0;
const int yPin = A1;
const int button1Pin = 2;
const int button2Pin = 3;
const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

void setup() {
  pinMode(button1Pin, INPUT_PULLUP);
  pinMode(button2Pin, INPUT_PULLUP);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int x = analogRead(xPin);
  int y = analogRead(yPin);
  int b1 = !digitalRead(button1Pin);
  int b2 = !digitalRead(button2Pin); 

  Serial.print("X:");
  Serial.print(x);
  Serial.print(",Y:");
  Serial.print(y);
  Serial.print(",B1:");
  Serial.print(b1);
  Serial.print(",B2:");
  Serial.println(b2);

  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input.startsWith("LED:")) {
      int r = 0, g = 0, b = 0;
      sscanf(input.c_str(), "LED:%d,%d,%d", &r, &g, &b);

      analogWrite(redPin, r);
      analogWrite(greenPin, g);
      analogWrite(bluePin, b);

    } 
  }

  delay(50);
}
