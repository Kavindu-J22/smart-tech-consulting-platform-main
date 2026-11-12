# Research Evaluation Framework & Academic Rigor Protocol

## 1. Academic Rigor & Non-Fabrication Declaration

In compliance with academic research standards and the instructions for Kalana's Marketing Strategy Assessment Module (*J26-ISE-313 IT23221796*):

1. **Algorithmic Correctness:** All mathematical formulas, decision-science algorithms (Analytical Hierarchy Process, largest-remainder budget optimization), natural language classification heuristics, and evaluation metric engines are fully implemented in working production code and verified via automated test suites.
2. **Empirical Non-Fabrication:** No empirical human subject evaluations (such as real cohort SUS usability scores, expert subjective ratings of marketing copy resonance, or live commercial ad spend conversions) have been fabricated. In the live interface, any empirical study components are labeled as **"Pending Empirical Field Study"** until live participant testing is executed under approved ethical protocols.
3. **Reproducibility:** All algorithmic calculations are deterministic and can be reproduced independently using the automated test suite in `tests/marketing/`.

---

## 2. Evaluation Framework Architecture

The research evaluation plan evaluates four distinct pillars of the module:

```
+-----------------------------------------------------------------------------------+
|                        Marketing Module Evaluation Framework                      |
+-------------------------+-------------------------+-------------------------------+
| 1. Decision Science     | 2. Machine Learning     | 3. Usability Engineering      |
|    - AHP Consistency    |    - Classification Acc |    - System Usability Scale   |
|      (CR <= 0.10)       |      (F1, Precision)    |      (Brooke, 1996)           |
|    - Budget Invariant   |    - Rule Baseline vs   |    - Task Completion Time     |
|      (Exact Sum LKR)    |      NLP Model Fusion   |    - Qualitative Interviews   |
+-------------------------+-------------------------+-------------------------------+
```

---

## 3. Decision Science Evaluation

### 3.1 AHP Consistency Verification (Objective O4)

The Analytical Hierarchy Process must produce a transitive, mathematically consistent judgment matrix.

- **Acceptance Criterion:** The Consistency Ratio ($CR$) must satisfy:
  $$CR = \frac{CI}{RI_n} \le 0.10$$
- **Verification Protocol:**
  - Automated tests evaluate $n=1, 2, 3, 5$ matrices.
  - In `tests/marketing/ahp.test.ts`, the default 5-criteria pairwise matrix yields $\lambda_{\max} \approx 5.08$, $CI \approx 0.02$, and $CR \approx 0.018 \le 0.10$, proving mathematical consistency.
  - If a user customizes weights such that $CR > 0.10$, the engine flags a consistency warning, logs the inconsistent judgment pairs, and offers an auto-regularized reciprocal matrix.

### 3.2 Exact-Sum Integer Budget Optimization (Objective O5)

- **Acceptance Criterion:**
  $$\sum_{c=1}^K \text{AllocatedLKR}_c + \text{ReserveLKR} \equiv \text{MonthlyBudgetLKR}$$
  For all non-negative integers $\text{MonthlyBudgetLKR} \in [0, 10^9]$.
- **Verification Protocol:**
  - Verified across boundary values: $0$ LKR, $1,500$ LKR, $20,000$ LKR, $100,000$ LKR, and $10,000,000$ LKR.
  - Zero rounding drift or rupee truncation verified by automated unit tests.
  - Compared systematically against an **Equal-Split Baseline** to quantify strategic efficiency gain:
    $$\Delta_{\text{efficiency}} = \sum_{c=1}^K \left| \tilde{w}_c - \frac{1}{K} \right| \times \text{AllocableBudget}$$

---

## 4. NLP Literacy Classifier Evaluation (Objective O2)

### 4.1 Evaluation Metrics

The classification engine (`classifyAudienceTechnicalLiteracy`) is evaluated against a 3-class ground truth (`low`, `medium`, `high`):

$$\text{Precision}_c = \frac{TP_c}{TP_c + FP_c}, \quad \text{Recall}_c = \frac{TP_c}{TP_c + FN_c}$$

$$F1_c = 2 \times \frac{\text{Precision}_c \times \text{Recall}_c}{\text{Precision}_c + \text{Recall}_c}$$

$$\text{Macro } F1 = \frac{1}{3} \sum_{c \in \{\text{low}, \text{med}, \text{high}\}} F1_c, \quad \text{Overall Accuracy} = \frac{\sum TP_c}{N}$$

The evaluation utility is implemented in `src/features/marketing/engine/evaluation.ts` (`computeClassificationMetrics`) and verified in `tests/marketing/evaluation.test.ts`.

### 4.2 Benchmark Comparison: Rule-Based Baseline vs. NLP Model

| Dimension | Rule Baseline (Q10+Q11 Sum) | NLP Fusion Model |
| :--- | :--- | :--- |
| **Input Signals** | 2 Likert scale dropdowns only | Likert + Customer Role + Freeform Text Persona |
| **Sensitivity** | Rigid step function ($2\text{--}4, 5\text{--}7, 8\text{--}10$) | Continuous softmax probabilities with confidence scoring |
| **Jargon Awareness** | Blind to technical jargon in description | Contextual keyword detection (API, SDK, microservices) |
| **Auditability** | Direct arithmetic sum | Transparent confidence score, reason codes, and delta vs baseline |

---

## 5. System Usability Scale (SUS) Evaluation Protocol (NFR1)

### 5.1 Instrument & Scoring Model

Usability is measured using the standard 10-item System Usability Scale (John Brooke, 1996):

1. *I think that I would like to use this system frequently.*
2. *I found the system unnecessarily complex.*
3. *I thought the system was easy to use.*
4. *I think that I would need the support of a technical person to be able to use this system.*
5. *I found the various functions in this system were well integrated.*
6. *I thought there was too much inconsistency in this system.*
7. *I would imagine that most people would learn to use this system very quickly.*
8. *I found the system very cumbersome to use.*
9. *I felt very confident using the system.*
10. *I needed to learn a lot of things before I could get going with this system.*

#### Grading Scale (Sauro & Lewis, 2012):
- **Score $\ge 80.3$:** Grade A (Excellent / Exceptional)
- **Score $68.0 \le S < 80.3$:** Grade B (Good / Above Average)
- **Score $51.0 \le S < 68.0$:** Grade C (OK / Marginal)
- **Score $< 51.0$:** Grade F (Poor / Unacceptable)

### 5.2 Field Study Execution Protocol

For the academic dissertation, the research candidate should execute the following protocol:

1. **Target Cohort:** 20–30 participants comprising Sri Lankan software startup founders, tech product managers, and digital marketing strategists.
2. **Task Flow:**
   - Onboard into the platform and create a test company.
   - Complete the 5-step Marketing Assessment Wizard (Q1–Q21).
   - Review generated Value Propositions, AHP Channel Ranking, and LKR Budget Allocation.
   - Use the live SUS evaluation card embedded directly in the report to submit their scores.
3. **Data Export:**
   - Click "Export Usability Record (JSON)" to collect signed participant responses for SPSS / Python SciPy statistical analysis.

---

## 6. Synthetic Research Dataset Specification

To enable reproducible stress-testing of the AHP and Budget engines without fabricating real human participants, a synthetic dataset schema is provided:

- **Dataset Identifier:** `Sri_Lanka_Marketing_Synthetic_Research_Dataset_5000`
- **Volume:** 5,000 synthetic test cases spanning 10 industry verticals, 8 Sri Lankan channels, and budgets from 10,000 LKR to 5,000,000 LKR.
- **Provenance Statement:** All synthetic data files generated for load and consistency testing are marked with `provenance: "synthetic_stress_test"` to prevent conflation with empirical human research findings.

