---
title: Charts with matplotlib
summary: Draw line, scatter, histogram and bar charts, label them, and show them with plt.show().
level: beginner
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt

      hours = np.array([1, 2, 3, 4, 5, 6, 7, 8])
      scores = np.array([48, 58, 57, 70, 68, 79, 76, 88])

      classes = ["A", "B", "C"]
      averages = [71.5, 66.25, 74.25]

      # Chart 1: a scatter chart of hours (x axis) against scores (y axis).
      #   Give it an x label, a y label and a title, then show it.
      # Chart 2: a bar chart of the class averages (one bar per class).
      #   Give it a title, then show it.
      # Finally print three lines:
      #   "points:" and how many points the scatter chart has (len of hours)
      #   "correlation:" and the correlation of hours and scores, 2 decimals
      #                  (np.corrcoef(hours, scores)[0, 1] gives it)
      #   "best class:" and the class name with the highest average
check:
  output: |
    points: 8
    correlation: 0.96
    best class: C
  code:
    - { pattern: 'plt\.scatter\s*\(', message: "Draw the first chart with plt.scatter(hours, scores)." }
    - { pattern: 'plt\.bar\s*\(', message: "Draw the second chart with plt.bar(classes, averages)." }
    - { pattern: 'plt\.xlabel\s*\(', message: "Label the x axis with plt.xlabel(...)." }
    - { pattern: 'plt\.ylabel\s*\(', message: "Label the y axis with plt.ylabel(...)." }
    - { pattern: 'plt\.title\s*\(', message: "Give a chart a title with plt.title(...)." }
    - { pattern: 'plt\.show\s*\(', message: "Show the chart with plt.show()." }
hints:
  - "matplotlib works in steps: draw something (plt.scatter, plt.bar, ...), decorate it (plt.xlabel, plt.ylabel, plt.title), then plt.show() to display it. Start the second chart after the first show."
  - "plt.scatter(hours, scores)   plt.xlabel(\"Hours studied\")   plt.ylabel(\"Score\")   plt.title(\"Score by hours\")   plt.show()   and then plt.bar(classes, averages) with its own title and plt.show()."
  - "best = classes[averages.index(max(averages))]  and  print(\"correlation:\", round(np.corrcoef(hours, scores)[0, 1], 2))"
solution:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt

      hours = np.array([1, 2, 3, 4, 5, 6, 7, 8])
      scores = np.array([48, 58, 57, 70, 68, 79, 76, 88])

      classes = ["A", "B", "C"]
      averages = [71.5, 66.25, 74.25]

      plt.scatter(hours, scores)
      plt.xlabel("Hours studied")
      plt.ylabel("Score")
      plt.title("Score by hours studied")
      plt.show()

      plt.bar(classes, averages)
      plt.title("Average score per class")
      plt.show()

      print("points:", len(hours))
      print("correlation:", round(np.corrcoef(hours, scores)[0, 1], 2))
      print("best class:", classes[averages.index(max(averages))])
quiz:
  - q: "Which chart type is best for seeing how two numeric columns relate?"
    options: ["Scatter chart", "Pie chart", "Bar chart of the averages"]
    answer: 0
  - q: "Which chart shows how the values of ONE column are distributed?"
    options: ["Scatter", "Histogram", "Line"]
    answer: 1
    explain: "A histogram counts how many values fall into each range (bin), so you see the shape of the data."
  - q: "What does plt.show() do in these lessons?"
    options: ["Saves the chart to a file", "Prints the numbers of the chart", "Displays the chart in the output panel"]
    answer: 2
  - q: "Why should every chart have axis labels and a title?"
    options: ["So the reader knows what is being shown", "Because matplotlib refuses to draw without them", "To make the chart load faster"]
    answer: 0
---

A table of numbers hides patterns that a picture shows in a second. Charts are how you check your data before modelling and how you judge a model afterwards. The standard Python plotting library is **matplotlib**, and you use it through its `pyplot` module, imported by convention as `plt`.

## The three-step rhythm

Almost every chart is the same three steps: **draw**, **decorate**, **show**.

```python
import matplotlib.pyplot as plt

days = [1, 2, 3, 4, 5]
sales = [3, 5, 4, 8, 9]

plt.plot(days, sales)            # 1. draw a line chart
plt.xlabel("Day")                # 2. decorate
plt.ylabel("Sales")
plt.title("Sales per day")
plt.show()                       # 3. show it
```

`plt.show()` displays the chart in the output panel below your code. After `show()` the figure is finished and the next drawing starts a fresh blank chart. The first time you import matplotlib the browser downloads it, so be patient on the first run.

## Four chart types you will use constantly

| Chart | Call | Use it for |
|---|---|---|
| Line | `plt.plot(x, y)` | A value that changes in order, such as time or a model's learning progress |
| Scatter | `plt.scatter(x, y)` | The relationship between two numeric columns, one dot per row |
| Histogram | `plt.hist(values, bins=5)` | The distribution of one column: how many values fall in each range |
| Bar | `plt.bar(names, heights)` | Comparing a number across categories |

A **scatter chart** is the most important one for machine learning. If the dots form a rising band, the two columns are positively related and a straight-line model will work. If they look like random fog, there is nothing to learn. For one column, a **histogram** groups the values into ranges called **bins** and draws how many fall into each, so you can see whether the data is bell-shaped, lopsided or has strange outliers.

## Several things in one chart

Call the drawing functions several times before `plt.show()` and everything lands on the same axes. Add `label=` and `plt.legend()` to tell lines apart:

```python
plt.scatter(days, sales, label="real data")
plt.plot(days, [2, 4, 6, 8, 10], color="red", label="a guess")
plt.legend()
plt.show()
```

You will use exactly this pattern later to draw a model's line on top of the data.

## Plotting from NumPy and pandas

matplotlib accepts lists, NumPy arrays and pandas columns alike: `plt.scatter(df["hours"], df["score"])`. DataFrames also have a shortcut, `df.plot()`, but knowing `plt` directly lets you control every detail.

## What the chart tells you

For the exercise, the dots of hours against scores climb steadily from the lower left to the upper right, which agrees with the correlation of 0.96 that you print. A chart and a number are two views of the same fact, and it is worth checking both. A correlation can be misleading, but a picture rarely is.

> **Watch out:**
> - Forgetting `plt.show()`: the code runs without error, but you see no chart.
> - Putting the decorations after `plt.show()`: the title and labels then belong to the next, blank chart. Draw, decorate, then show.
> - Giving x and y different lengths raises `ValueError: x and y must be the same size`.
> - Charts with no title, no labels or unreadable colours. A chart you cannot read is a chart that did not do its job.
> - Piling thousands of dots on top of each other. Use `plt.scatter(x, y, alpha=0.3)` to make the dots see-through.

> **Your turn:** draw a labelled scatter chart of hours against scores and show it, then draw a titled bar chart of the class averages and show it. Finally print the three lines from the expected output.
