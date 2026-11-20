---
title: "Feedback GRAPE: A python library for machine learning based optimal quantum control"
date: 2025-08-04
tags: [JAX, Python, RNNs, Quantum Computing]
heroImage: /images/blog/feedback-grape/rl-control-sequence-hero.webp
excerpt: "An Introduction to Feedback GRAPE, a machine learning based extension to the GRAPE algorithm for optimal quantum control, and the python library implementing it."
---

## What is Quantum Optimal Control?

Quantum Optimal Control is a field focusing on finding the optimal control pulses that
would drive a quantum system from an initial state to a target state. Compared with
the classical theory of control, a simple example would be the inverted pendulum on a
moving cart. The pendulum starts at a resting position facing downwards (the initial
state), and the goal is to find how to move the car’s actuators such that the pendulum
is balanced in an upright position. There are several different techniques to do that
for classical control engineering, like PID controllers, pole placement, or even
some machine learning techniques. 

![inverted pendulum on a cart (source: [tentone/cart-pendulum](https://tentone.github.io/cart-pendulum/))](/images/blog/feedback-grape/Inverted-Pendulum.png "width=50%")

When trying to control quantum systems, there is
similarity in the objective of driving a system from an initial state to a target state,
or even in maintaining and stabilizing a certain initial state over time, however
in quantum optimal control, we try to measure quantum mechanical quantities rather
than the classical quantities we are used to in our daily lives. There are many quantum
control algorithms and their applications lie at the heart of many of the quantum
technologies that are emerging or have emerged in the recent decades, from
controlling quantum information units called qubits and engineering the pulses that
controls and performs operations on them for certain quantum computing platforms, to
quantum error correction, where the performance and reliability of qubits are improved,
and Nuclear Magnetic Resonance (NMR) applications for which Gradient Ascent
Pulse Engineering Gradient Ascent Pulse Engineering (GRAPE) (Khaneja, et al.) was first introduced.

![controling a qubit](/images/blog/feedback-grape/controling-a-qubit.png "width=25%")


## Where does Machine Learning Come Into Play?

As suggested by the name GRAPE, it uses gradient ascent in an optimization process to try to maximize a certain reward quality called fidelity, which specifies how close two quantum states are to each other (there are also other rewards that can be defined for such an optimization process). However, the novelty of GRAPE lies in its ability to incorporate the quantum-mechanical dynamics of the system in the optimization process; thus, the navigation of the objective function is performed by calculating gradients of the quantum dynamics to try to reach the maximal fidelity. At the time, this was a novel approach and made the algorithm one of the most successful and most used algorithms for optimal quantum control, and is in fact implemented in many software packages such as QuTip and others. Since then, automatic differentiation with frameworks such as PyTorch, TensorFlow, and JAX was primarily used rather than using the analytically derived methods derived in the original paper.


![Progress with training iterations for different random seeds and learning rates (indicated as "lr"). The training was performed in all cases for 3000 iterations. Parameters controling the qubit are optimized with each training step to yield the highest reward (fidelity), naturally, hyper-parameters need to be tuned to avoid local minima.](/images/blog/feedback-grape/paper_code_lr_seed.png)

## A Crucial Extention

There has been, however, one crucial extension that was missing from the original GRAPE implementation, which is feedback. Recently, a new approach was presented by Porotti et al. providing this very extension. Feedback GRAPE borrows concepts from Reinforcement Learning (RL) to incorporate the stochastic outcomes of quantum measurements as feedback to help influence the process of searching for the optimal control sequence. There is a set of already existing machine learning techniques for feedback, namely, model-free RL, and there have been several attempts to use model-free RL to find optimal feedback strategies for quantum systems. Those model-free techniques try to discover feedback strategies without taking gradients through quantum dynamics. The authors of the original paper, however, have devised a way to incorporate feedback of quantum measurements into a gradient-based method such as GRAPE, making use of the knowledge of the differentiable quantum dynamics, and essentially creating - using the language of RL - a model-based method. Deep-learning concepts such as Recurrent Neural Networks (RNN) or lookup tables are used in order to maintain memory of previous measurement outcomes to influence the choice of optimizable parameters for the future measurements. This feedback-GRAPE method has proven to lead to significant improvements over model-free methods to incorporate feedback into finding the optimal control pulses for tasks such as state preparation, purification, stabilization, and even for some error correcting tasks.


![feedback loop: A physical system is controlled using a feedback loop mechanism: Measurement outcomes from the quantum system are fed into a recurrent neural network or a lookup table which generates the control parameters for the next time step.](/images/blog/feedback-grape/rl-feedback-loop.svg)

## Building the Library

We therefore provide a Python framework using JAX’s powerful automatic differentiation, vectorization, and GPU-compatiblity to implement bothGRAPE and feedback-GRAPE in a generic, efficient, and GPU-enabled manner. We illustrate the interface of our package, introduce a new intuitive API for composite systems, and demonstrate the successful results in several state preparation and stabilization tasks.

You can find the documentation here: [here](https://feedbackgrape.readthedocs.io/en/latest/) <br>
The Github Repo: [here](https://github.com/YousefElbrolosy/feedback-grape)

## Outlook

Combining Machine Learning (and AI) for physics applications (which is the focus of Florian Marquardt's (My supervisor at the time - along with Pavlo Bilous -) Theoretical Physics department at MPL), is a promising (and inevitable) endevour that unlocks otherwise not so obvious solutions to many of the current problems.
We hope this library becomes useful for the commnuity interested in quantum optimal control and even for the casual learners wanting to experiment with the procedures that are used to produce the control pulses for many of the current quantum computers. 

Please feel free to raise issues, suggest different ways in which memory can be managed (a recent article showed that transformers can be useful here as well! see [Quantum feedback control with a transformer neural network architecture](https://journals.aps.org/prresearch/abstract/10.1103/m429-jy1j)) and share your opinion!


## References and Links to Arxiv Preprint

Khaneja, Navin, et al. "Optimal control of coupled spin dynamics: design of NMR pulse sequences by gradient ascent algorithms." Journal of magnetic resonance 172.2 (2005): 296-305.

Riccardo Porotti, Vittorio Peano, and Florian Marquardt. Gradient-ascent pulse engineering with feedback. PRX Quantum, 4(3):030305, 2023.

Yousef Elbrolosy, Adrian Bories, Florian Marquardt, and Pavlo Bilous. feedback-grape: A JAX-based Python Package for GPU-Accelerated GRAPE with Feedback. arXiv preprint [arXiv:2611.20222](https://arxiv.org/abs/2611.20222), 2026.
