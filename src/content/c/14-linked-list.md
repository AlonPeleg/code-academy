---
title: A linked list with malloc and free
summary: Build a growable chain of nodes on the heap, walk it with a pointer and free every node.
level: advanced
runner: remote
files:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <stdlib.h>

      struct Node {
          int value;
          struct Node *next;
      };

      // 1. Add a new node holding value at the FRONT of the list and return the new head.
      //    Allocate it with malloc(sizeof(struct Node)); its next must be the old head.
      struct Node *push_front(struct Node *head, int value) {
          return head;
      }

      // 2. Add a new node holding value at the END of the list and return the head.
      //    If the list is empty the new node becomes the head. Otherwise walk to the last node
      //    (the one whose next is NULL) and attach the new node there.
      struct Node *push_back(struct Node *head, int value) {
          return head;
      }

      // 3. Print the values like:  3 -> 2 -> 1 -> NULL   (just NULL for an empty list)
      void print_list(const struct Node *head) {
          printf("NULL\n");
      }

      // 4. Count the nodes.
      int length(const struct Node *head) {
          return 0;
      }

      // 5. Free every node. Save the next pointer BEFORE freeing the current node.
      void free_list(struct Node *head) {
      }

      int main(void) {
          struct Node *list = NULL;

          list = push_front(list, 1);
          list = push_front(list, 2);
          list = push_front(list, 3);
          print_list(list);

          list = push_back(list, 0);
          print_list(list);
          printf("Length: %d\n", length(list));

          free_list(list);
          list = NULL;
          print_list(list);
          return 0;
      }
check:
  output: |
    3 -> 2 -> 1 -> NULL
    3 -> 2 -> 1 -> 0 -> NULL
    Length: 4
    NULL
  code:
    - { pattern: 'malloc\s*\(\s*sizeof\s*\(\s*struct\s+Node\s*\)\s*\)', message: "Allocate a node with malloc(sizeof(struct Node))." }
    - { pattern: 'free\s*\(', message: "Free every node with free." }
    - { pattern: '->\s*next', message: "Follow the chain through the next pointer (node->next)." }
hints:
  - "Each node stores a value and a pointer to the next node, and the last next is NULL. To walk the list, keep a pointer like current and move it with current = current->next until it is NULL."
  - "push_front: allocate a node, set node->value and node->next = head, return node. push_back: allocate, set next to NULL, then loop while (current->next != NULL) to find the last node. free_list: while (head != NULL) { struct Node *next = head->next; free(head); head = next; }"
  - "struct Node *node = malloc(sizeof(struct Node)); node->value = value; node->next = head; return node;   print: for (const struct Node *p = head; p != NULL; p = p->next) printf(\"%d -> \", p->value); printf(\"NULL\\n\");   length: int n = 0; for (...) n++;"
solution:
  - name: main.c
    code: |
      #include <stdio.h>
      #include <stdlib.h>

      struct Node {
          int value;
          struct Node *next;
      };

      struct Node *push_front(struct Node *head, int value) {
          struct Node *node = malloc(sizeof(struct Node));
          if (node == NULL) {
              return head;
          }
          node->value = value;
          node->next = head;
          return node;
      }

      struct Node *push_back(struct Node *head, int value) {
          struct Node *node = malloc(sizeof(struct Node));
          if (node == NULL) {
              return head;
          }
          node->value = value;
          node->next = NULL;
          if (head == NULL) {
              return node;
          }
          struct Node *current = head;
          while (current->next != NULL) {
              current = current->next;
          }
          current->next = node;
          return head;
      }

      void print_list(const struct Node *head) {
          for (const struct Node *p = head; p != NULL; p = p->next) {
              printf("%d -> ", p->value);
          }
          printf("NULL\n");
      }

      int length(const struct Node *head) {
          int count = 0;
          for (const struct Node *p = head; p != NULL; p = p->next) {
              count++;
          }
          return count;
      }

      void free_list(struct Node *head) {
          while (head != NULL) {
              struct Node *next = head->next;
              free(head);
              head = next;
          }
      }

      int main(void) {
          struct Node *list = NULL;

          list = push_front(list, 1);
          list = push_front(list, 2);
          list = push_front(list, 3);
          print_list(list);

          list = push_back(list, 0);
          print_list(list);
          printf("Length: %d\n", length(list));

          free_list(list);
          list = NULL;
          print_list(list);
          return 0;
      }
quiz:
  - q: What marks the end of a linked list?
    options: ["A node whose value is 0", "A node whose next pointer is NULL", "The array size"]
    answer: 1
  - q: Why must free_list save head->next BEFORE calling free(head)?
    options: ["free changes the next pointer to NULL", "It is only a style choice", "After free the node's memory is gone, so reading head->next would be use after free"]
    answer: 2
  - q: What is an advantage of a linked list over an array?
    options: ["Inserting at the front is cheap, and it grows one node at a time without copying everything", "Reading the 1000th element is faster", "It uses less memory per element"]
    answer: 0
  - q: What does passing struct Node *head by value to push_front mean for the caller's own variable?
    options: ["The function changes the caller's variable automatically", "The function receives a copy of the pointer, so it returns the new head and the caller must assign it", "The list is copied"]
    answer: 1
    explain: "That is why we write list = push_front(list, 3). The function cannot change the caller's pointer variable, only what it points to."
---

An array has a fixed size and its items sit next to each other. A **linked list** is a different way to store a sequence: every item lives in its own small block of heap memory called a **node**, and each node holds a pointer to the next one. The chain can grow and shrink while the program runs. Linked lists are the classic exercise for understanding pointers, `malloc` and `free` together, and the idea behind many real data structures (queues, stacks, hash-table buckets).

## The node

```c
struct Node {
    int value;
    struct Node *next;
};
```

A `Node` stores a `value` and a pointer to another `Node`. C allows a struct to contain a pointer to its own type. The whole list is represented by a pointer to the first node, the **head**. The last node's `next` is `NULL`, which means "nothing follows". An empty list is simply `head == NULL`.

```text
head -> [3 | *]--> [2 | *]--> [1 | NULL]
```

## Adding nodes

Each node comes from `malloc`, so it stays alive after the function that created it returns:

```c
struct Node *push_front(struct Node *head, int value) {
    struct Node *node = malloc(sizeof(struct Node));
    node->value = value;
    node->next = head;     // the old list hangs behind the new node
    return node;           // the new node is the new head
}
```

Two things to notice:

- `node->value` is shorthand for `(*node).value`: the `->` arrow reaches a member through a pointer.
- The function **returns the new head**. A function gets a *copy* of the `head` pointer, so assigning to it inside would not change the caller's variable. The caller writes `list = push_front(list, 3);`.

Adding at the **end** needs a walk: start at the head and follow `next` until you reach the node whose `next` is `NULL`:

```c
struct Node *current = head;
while (current->next != NULL) {
    current = current->next;
}
current->next = node;
```

This is the standard way to **traverse** a list, and it takes time proportional to the length. (That is why adding at the front is cheap, and adding at the back is not, unless you also remember a tail pointer.)

## Printing and counting

The same walk works with a `for` loop:

```c
for (const struct Node *p = head; p != NULL; p = p->next) {
    printf("%d -> ", p->value);
}
printf("NULL\n");        // prints: 3 -> 2 -> 1 -> NULL
```

We print no addresses, only values, so the output is the same on every run.

## Freeing the list

Every `malloc` needs a `free`, so you must visit every node. There is a trap: once you `free(head)`, the node is gone, and reading `head->next` afterwards is **use after free**. So save the next pointer first:

```c
while (head != NULL) {
    struct Node *next = head->next;   // remember where to go
    free(head);                       // now release this node
    head = next;
}
```

After this the caller's pointer still holds the old address of the first node, which is invalid. A good habit is setting it to `NULL` straight away, as `main` does.

## Checking your work

You can compile with `gcc -fsanitize=address -g` on your own machine and AddressSanitizer reports leaks and use after free; `valgrind ./a.out` does a similar job.

> **Watch out:**
> - Forgetting to set `node->next = NULL` for a new last node: the garbage in the uninitialised field makes the walk run off the end and crash with `Segmentation fault`.
> - Freeing a node and then reading `head->next`: use after free, with random results or `AddressSanitizer: heap-use-after-free`.
> - Not freeing at all: a **memory leak** (`LeakSanitizer: detected memory leaks`).
> - Calling `current->next` when `current` is `NULL`: a segmentation fault. In `push_back`, handle the empty list first.
> - Writing `push_front(list, 3);` without assigning the result: the new node is lost, and it leaks.

## Going further

Write `reverse(head)` that flips all the `next` pointers using three pointers (`previous`, `current`, `next`), or `remove_value(head, v)` that unlinks the first node holding `v` and frees it.

> **Your turn:** write `push_front`, `push_back`, `print_list`, `length` and `free_list` so that `main` prints the list as `3 -> 2 -> 1 -> NULL`, then `3 -> 2 -> 1 -> 0 -> NULL`, then `Length: 4`, and finally `NULL` for the freed (empty) list.
