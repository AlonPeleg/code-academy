import type { RunnerConfig, SourceFile } from '../runners/types';

export interface Preset {
  id: string;
  label: string;
  group: 'Web' | 'Scripting' | 'Data' | 'Compiled' | 'Games';
  config: RunnerConfig;
  files: SourceFile[];
  stdin?: string;
}

const GAME_INPUT = `# The player's key presses: <frame> <key> <down|up>
# Edit these lines to "play" the game differently.
10 right down
50 right up
50 down down
80 down up
80 left down
110 left up`;

const f = (name: string, language: string, code: string): SourceFile => ({ name, language, code: code.replace(/^\n/, '').replace(/\n$/, '') });

export const PRESETS: Preset[] = [
  {
    id: 'web', label: 'HTML / CSS / JS', group: 'Web', config: { runner: 'web' },
    files: [
      f('index.html', 'html', `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Hello, sandbox!</h1>
    <button id="btn">Click me</button>
    <p id="out"></p>
    <script src="script.js"></script>
  </body>
</html>`),
      f('style.css', 'css', `
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
}
h1 {
  color: rebeccapurple;
}`),
      f('script.js', 'javascript', `
let clicks = 0;
document.getElementById('btn').addEventListener('click', () => {
  clicks++;
  document.getElementById('out').textContent = 'Clicked ' + clicks + ' times';
  console.log('click', clicks);
});`),
    ],
  },
  {
    id: 'react', label: 'React (JSX)', group: 'Web', config: { runner: 'react' },
    files: [
      f('App.jsx', 'javascript', `
import { useState } from 'react';
import './styles.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <h1>Hello, React!</h1>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}

export default App;`),
      f('styles.css', 'css', `
.card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
}
button {
  font-size: 16px;
  padding: 8px 14px;
}`),
    ],
  },
  {
    id: 'react-tsx', label: 'React (TSX)', group: 'Web', config: { runner: 'react' },
    files: [
      f('App.tsx', 'typescript', `
import { useState } from 'react';

interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <Greeting name="TypeScript" />
      <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
    </div>
  );
}

export default App;`),
    ],
  },
  {
    id: 'js', label: 'JavaScript', group: 'Scripting', config: { runner: 'js' },
    files: [f('main.js', 'javascript', `
const languages = ['JavaScript', 'Python', 'SQL'];

for (const lang of languages) {
  console.log('I am learning ' + lang);
}

console.log({ total: languages.length });`)],
  },
  {
    id: 'api', label: 'REST / SOAP APIs', group: 'Scripting', config: { runner: 'js' },
    files: [f('main.js', 'javascript', `
// A practice server lives at https://api.academy.test (works offline, resets on every run).
// REST:  /users  /todos  /posts  /login  /me      SOAP:  /soap/calculator?wsdl  /soap/students
const res = await fetch('https://api.academy.test/users?role=editor');
console.log(res.status, res.statusText);
console.log('Total:', res.headers.get('X-Total-Count'));

const users = await res.json();
for (const u of users) {
  console.log(u.id, u.name, '-', u.city);
}

// SOAP: an XML request in an envelope
const reply = await fetch('https://api.academy.test/soap/calculator', {
  method: 'POST',
  headers: { 'Content-Type': 'text/xml', SOAPAction: 'http://academy.test/calculator/Add' },
  body: \`<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body><Add><a>20</a><b>22</b></Add></soap:Body>
</soap:Envelope>\`,
});
console.log('SOAP result:', parseXML(await reply.text()).get('result'));`)],
  },
  {
    id: 'ts', label: 'TypeScript', group: 'Scripting', config: { runner: 'ts' },
    files: [f('main.ts', 'typescript', `
interface Student {
  name: string;
  age: number;
}

function greet(student: Student): string {
  return \`Hi \${student.name}, you are \${student.age}\`;
}

console.log(greet({ name: 'Ava', age: 21 }));`)],
  },
  {
    id: 'python', label: 'Python', group: 'Scripting', config: { runner: 'python' },
    files: [f('main.py', 'python', `
name = input("What is your name? ")
print("Hello,", name)

for i in range(3):
    print("Line", i + 1)`)],
    stdin: 'Ada',
  },
  {
    id: 'ml', label: 'Python + ML', group: 'Data', config: { runner: 'python' },
    files: [f('main.py', 'python', `
# NumPy, pandas, matplotlib and scikit-learn download the first time you run this (needs internet).
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

hours = np.array([[1], [2], [3], [4], [5], [6]])
score = np.array([52, 58, 65, 71, 77, 84])

model = LinearRegression()
model.fit(hours, score)
print("Each extra hour adds about", round(model.coef_[0], 1), "points")
print("Predicted score for 7 hours:", round(model.predict([[7]])[0], 1))

plt.scatter(hours, score, label="students")
plt.plot(hours, model.predict(hours), color="red", label="model")
plt.xlabel("hours studied")
plt.ylabel("score")
plt.legend()
plt.show()`)],
  },
  {
    id: 'sql', label: 'SQL', group: 'Data', config: { runner: 'sql' },
    files: [f('query.sql', 'sql', `
-- Open the "Sample data" tab to see the tables
SELECT name, city
FROM students
WHERE age > 20
ORDER BY name;`)],
  },
  {
    id: 'c', label: 'C', group: 'Compiled', config: { runner: 'remote', remoteLang: 'c' },
    files: [f('main.c', 'c', `
#include <stdio.h>

int main(void) {
    printf("Hello from C!\\n");
    return 0;
}`)],
  },
  {
    id: 'cpp', label: 'C++', group: 'Compiled', config: { runner: 'remote', remoteLang: 'cpp' },
    files: [f('main.cpp', 'cpp', `
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}`)],
  },
  {
    id: 'csharp', label: 'C#', group: 'Compiled', config: { runner: 'remote', remoteLang: 'csharp' },
    files: [f('Program.cs', 'csharp', `
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello from C#!");
    }
}`)],
  },
  {
    id: 'java', label: 'Java', group: 'Compiled', config: { runner: 'remote', remoteLang: 'java' },
    files: [f('Main.java', 'java', `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`)],
  },
  {
    id: 'go', label: 'Go', group: 'Compiled', config: { runner: 'remote', remoteLang: 'go' },
    files: [f('main.go', 'go', `
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
}`)],
  },
  {
    id: 'rust', label: 'Rust', group: 'Compiled', config: { runner: 'remote', remoteLang: 'rust' },
    files: [f('main.rs', 'rust', `
fn main() {
    println!("Hello from Rust!");
}`)],
  },
  {
    id: 'pygame', label: 'Python game', group: 'Games', config: { runner: 'pygame' },
    files: [f('main.py', 'python', `
import game

x = 150
y = 110
speed = 120   # pixels per second

def update(dt):
    global x, y
    if game.key_down("left"):
        x -= speed * dt
    if game.key_down("right"):
        x += speed * dt
    if game.key_down("up"):
        y -= speed * dt
    if game.key_down("down"):
        y += speed * dt

def draw():
    game.clear(game.DARK)
    game.rect(x, y, 20, 20, game.YELLOW)
    game.text(8, 8, "Arrow keys to move")

game.run(update, draw)`)],
  },
  {
    id: 'jsgame', label: 'JavaScript game', group: 'Games', config: { runner: 'jsgame' },
    files: [f('main.js', 'javascript', `
let x = 150;
let y = 110;
const speed = 120; // pixels per second

function update(dt) {
  if (game.keyDown('left')) x -= speed * dt;
  if (game.keyDown('right')) x += speed * dt;
  if (game.keyDown('up')) y -= speed * dt;
  if (game.keyDown('down')) y += speed * dt;
}

function draw() {
  game.clear(game.DARK);
  game.rect(x, y, 20, 20, game.YELLOW);
  game.text(8, 8, 'Arrow keys to move');
}

game.run(update, draw);`)],
  },
  {
    id: 'cgame', label: 'C game', group: 'Games', config: { runner: 'remote', remoteLang: 'c', game: true },
    stdin: GAME_INPUT,
    files: [f('main.c', 'c', `
#include <stdio.h>
#include "engine.h"

int main(void) {
    int x = 150, y = 110;

    while (engine_running()) {
        /* update */
        if (key_down(KEY_LEFT))  x -= 3;
        if (key_down(KEY_RIGHT)) x += 3;
        if (key_down(KEY_UP))    y -= 3;
        if (key_down(KEY_DOWN))  y += 3;

        /* draw */
        engine_clear(RGB_DARK);
        engine_rect(x, y, 20, 20, RGB_YELLOW);
        engine_text(8, 8, 14, RGB_WHITE, "Scripted keys, replayed");
        engine_present();
    }

    printf("final position: %d, %d\\n", x, y);
    return 0;
}`)],
  },
  {
    id: 'cppgame', label: 'C++ game', group: 'Games', config: { runner: 'remote', remoteLang: 'cpp', game: true },
    stdin: GAME_INPUT,
    files: [f('main.cpp', 'cpp', `
#include <iostream>
#include "engine.h"
using namespace std;

struct Player {
    int x, y;
    void update() {
        if (key_down(KEY_LEFT))  x -= 3;
        if (key_down(KEY_RIGHT)) x += 3;
        if (key_down(KEY_UP))    y -= 3;
        if (key_down(KEY_DOWN))  y += 3;
    }
    void draw() { engine_rect(x, y, 20, 20, RGB_YELLOW); }
};

int main() {
    Player player = {150, 110};

    while (engine_running()) {
        player.update();

        engine_clear(RGB_DARK);
        player.draw();
        engine_text(8, 8, 14, RGB_WHITE, "Scripted keys, replayed");
        engine_present();
    }

    cout << "final position: " << player.x << ", " << player.y << endl;
    return 0;
}`)],
  },
  {
    id: 'csgame', label: 'C# game', group: 'Games', config: { runner: 'remote', remoteLang: 'csharp', game: true },
    stdin: GAME_INPUT,
    files: [f('Program.cs', 'csharp', `
using System;

class Player
{
    public int X = 150;
    public int Y = 110;

    public void Update()
    {
        if (Engine.KeyDown(Key.Left))  X -= 3;
        if (Engine.KeyDown(Key.Right)) X += 3;
        if (Engine.KeyDown(Key.Up))    Y -= 3;
        if (Engine.KeyDown(Key.Down))  Y += 3;
    }

    public void Draw()
    {
        Engine.Rect(X, Y, 20, 20, Color.Yellow);
    }
}

class Program
{
    static void Main()
    {
        Player player = new Player();

        while (Engine.Running())
        {
            player.Update();

            Engine.Clear(Color.Dark);
            player.Draw();
            Engine.Text(8, 8, 14, Color.White, "Scripted keys, replayed");
            Engine.Present();
        }

        Console.WriteLine("final position: " + player.X + ", " + player.Y);
    }
}`)],
  },
];

export const getPreset = (id: string) => PRESETS.find((p) => p.id === id);
