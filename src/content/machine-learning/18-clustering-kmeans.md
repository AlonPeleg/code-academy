---
title: Clustering with k-means
summary: Find groups in data that has no labels, pick the number of groups with the elbow of the inertia curve, and plot the result.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt
      from sklearn.cluster import KMeans
      from sklearn.datasets import make_blobs
      from sklearn.metrics import silhouette_score

      # 1. Make the data: 150 points in 3 blobs, cluster_std=0.9, random_state=7.
      #    (make_blobs returns X and the true labels; we will ignore the labels, as in real life.)
      #    Print X.shape.

      # 2. For k = 1 .. 6 fit KMeans(n_clusters=k, n_init=10, random_state=0) and print
      #    f"k={k} inertia={km.inertia_:.0f}".

      # 3. Fit the final model with k = 3 (same n_init and random_state). Print
      #    the sorted list of cluster sizes (np.bincount(km.labels_)), as a normal list,
      #    the sorted x-coordinates of the cluster centres rounded to 1 decimal,
      #    and f"silhouette {silhouette_score(X, km.labels_):.2f}".

      # 4. Scatter plot X coloured by km.labels_ (c=...), draw the centres with a big marker,
      #    add a title and call plt.show().
check:
  output: |
    (150, 2)
    k=1 inertia=9076
    k=2 inertia=1458
    k=3 inertia=220
    k=4 inertia=185
    k=5 inertia=157
    k=6 inertia=130
    [50, 50, 50]
    [-8.4 -1.4  9.6]
    silhouette 0.81
  code:
    - { pattern: 'make_blobs\s*\(', message: "Generate the points with make_blobs." }
    - { pattern: 'KMeans\s*\(', message: "Use KMeans(n_clusters=..., n_init=10, random_state=0)." }
    - { pattern: 'inertia_', message: "Read km.inertia_ for each k." }
    - { pattern: 'plt\.scatter\s*\(', message: "Draw the points with plt.scatter." }
    - { pattern: 'plt\.show\s*\(', message: "Call plt.show() to display the chart." }
hints:
  - "KMeans needs the number of groups up front: KMeans(n_clusters=k, n_init=10, random_state=0).fit(X). After fitting, km.labels_ is the group number of every point, km.cluster_centers_ the group centres and km.inertia_ the total squared distance to the centres."
  - "Loop with for k in range(1, 7): to collect inertia. Cluster sizes: np.bincount(km.labels_). Centres sorted by x: np.sort(km.cluster_centers_[:, 0]).round(1)."
  - "X, _ = make_blobs(n_samples=150, centers=3, cluster_std=0.9, random_state=7)   plt.scatter(X[:, 0], X[:, 1], c=km.labels_)   plt.scatter(km.cluster_centers_[:, 0], km.cluster_centers_[:, 1], marker='X', s=200, c='black')   plt.show()"
solution:
  - name: main.py
    code: |
      import numpy as np
      import matplotlib.pyplot as plt
      from sklearn.cluster import KMeans
      from sklearn.datasets import make_blobs
      from sklearn.metrics import silhouette_score

      X, _ = make_blobs(n_samples=150, centers=3, cluster_std=0.9, random_state=7)
      print(X.shape)

      for k in range(1, 7):
          km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
          print(f"k={k} inertia={km.inertia_:.0f}")

      km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
      print(sorted(np.bincount(km.labels_).tolist()))
      print(np.sort(km.cluster_centers_[:, 0]).round(1))
      print(f"silhouette {silhouette_score(X, km.labels_):.2f}")

      plt.scatter(X[:, 0], X[:, 1], c=km.labels_)
      plt.scatter(km.cluster_centers_[:, 0], km.cluster_centers_[:, 1],
                  marker="X", s=200, c="black")
      plt.title("k-means with k=3")
      plt.show()
quiz:
  - q: "What makes k-means 'unsupervised'?"
    options: ["It needs no computer", "It works without labels: it only looks at the features and invents the groups", "It cannot be tested"]
    answer: 1
  - q: "What does inertia measure?"
    options: ["The total squared distance from every point to the centre of its own cluster, lower means tighter clusters", "The number of clusters", "The accuracy"]
    answer: 0
  - q: "Inertia always goes down as k grows (it is 0 when k equals the number of points). So how do you pick k?"
    options: ["Always take the largest k", "Always take k = 2", "Look for the elbow where adding another cluster stops helping much"]
    answer: 2
  - q: "Why do we pass random_state and n_init=10 to KMeans?"
    options: ["The start is random, so we restart 10 times, keep the best run, and fix the randomness to be repeatable", "To make it classify", "To scale the data"]
    answer: 0
---

Sometimes nobody has labelled your data. You have customers, songs or flowers and you simply want to know: do natural groups exist? That is **clustering**. **k-means** is the most popular method, and you will use it on three blobs of points, choose the number of groups, and draw the result. Because there are no labels, this is called **unsupervised learning**.

## The algorithm in plain words

You tell k-means how many groups (`k`) you want. It then repeats two simple steps:

1. **Assign.** Give every point to the nearest of the k **centres** (also called centroids).
2. **Move.** Move every centre to the average position of the points assigned to it.

It starts with random centres, repeats until the centres stop moving, and you have your clusters. A tiny worked example in one dimension: points 1, 2, 9, 10 and starting centres 1 and 2. Assign: 1 goes to centre 1, the others go to centre 2. Move: centre 1 stays at 1, centre 2 becomes `(2 + 9 + 10) / 3 = 7`. Assign again: 2 is now closer to 1 (distance 1 versus 5), so it switches. Move: centres become `(1 + 2) / 2 = 1.5` and `(9 + 10) / 2 = 9.5`. Nothing changes any more, so the groups are {1, 2} and {9, 10}.

Because the start is random, k-means can get stuck in a mediocre solution. That is why scikit-learn runs it `n_init=10` times and keeps the best, and why you set `random_state` for repeatable results.

## Fitting it

```python
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
km.labels_            # the group number (0, 1 or 2) of every point
km.cluster_centers_   # one row per centre
km.predict([[0, 0]])  # nearest centre for a new point
```

Group numbers are arbitrary names: group 0 in one run may be group 2 in another. Do not read meaning into the numbers, only into who shares a group. Our data comes from `make_blobs`, which draws points around random centres; the second value it returns is the "true" blob of each point. Real data does not come with that answer key, so we ignore it with `_`.

## Choosing k: inertia and the elbow

**Inertia** is the sum over all points of the squared distance to their own centre. Smaller means tighter groups. But inertia always shrinks when you add clusters (with one cluster per point it would be 0), so you cannot just take the smallest value. Instead, plot or print inertia for several k and look for the **elbow**, the point where the drop suddenly becomes small:

```text
k=1 inertia=9076
k=2 inertia=1458
k=3 inertia=220
k=4 inertia=185
```

Going from 1 to 2 and from 2 to 3 slashes inertia massively, but 3 to 4 only trims 35. The bend is at k = 3, which matches the three blobs we generated. The **silhouette score** is a second opinion between -1 and 1: it compares how close each point is to its own cluster against the nearest other cluster. Values near 1 mean well separated groups, and 0.81 here is excellent.

## How to read the output

* `(150, 2)` means 150 points with 2 coordinates, so they can be plotted flat.
* The inertia list is your elbow chart in text form: look for where the numbers stop dropping fast.
* Cluster sizes `[50, 50, 50]` show k-means recovered three equal groups. Very lopsided sizes can hint at a bad k.
* On the plot, each colour is a cluster and each black X sits at the middle of its group.

> **Watch out:**
> - k-means measures straight-line distance, so features on different scales (see lesson 13) need `StandardScaler` first. Otherwise the biggest-number column decides everything.
> - It assumes round, similar-sized blobs. Rings, crescents or one huge and one tiny group are not found well.
> - Forgetting that `km.labels_` has trailing underscore: `km.labels` raises `AttributeError`.
> - Treating clusters as truth. They are a suggestion of structure; you still have to look at them and ask whether they make sense.
> - Using `fit_predict` and `predict` interchangeably: `predict` needs an already fitted model.

> **Your turn:** generate the three blobs, print the inertia for k = 1 to 6, fit the final k = 3 model, print the cluster sizes, the sorted centre x-values and the silhouette score, and plot the clusters with their centres.
