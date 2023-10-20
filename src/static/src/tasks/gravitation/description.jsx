/**
 * @brief The module contents components to describe and formulate task problem verbose.
 */
import 'katex/dist/katex.min.css'
import {InlineMath} from 'react-katex'

// define general system equations
const problemLabel = "\\frac{d^{2}\\vec{r_{i}}}{dt^{2}}=\\sum_{j=1, j\\neq i}^{N}{g\\cdot \\frac{m_{j}}{m_{i}} \\cdot \\frac{\\vec{r_{i}}-\\vec{r_{j}}}{|\\vec{r_{i}}-\\vec{r_{j}}|^3}}, i=1,..,N"

/**
 * @brief Show latex-style equations formulated physics task problem.
 * @returns custom rect component
 */
const ProblemAnnatation = () => {
    return (<>
        <InlineMath math = {problemLabel}/>
    </>)
}

export {ProblemAnnatation}