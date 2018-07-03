const JSON = require('circular-json');

/* istanbul ignore next */
const getData = ({ cache, firstStep, steps, initialRenderedSteps }, callback) => {
  let currentStep = firstStep;
  const previousSteps = [steps[currentStep.id]];
  const previousStep = {};

  const markStepAsRendered = (step) => {
    // remove delay of cached rendered steps
    step.delay = 0;
    // flag used to avoid call triggerNextStep in cached rendered steps
    step.rendered = true;

    // an error is thrown when render a component from localStorage.
    // So it's necessary reassing the component
    if (step.component) {
      const id = step.id;
      step.component = steps[id].component;
    }
  };

  // allow initially visible steps
  const renderedSteps = initialRenderedSteps ?
    initialRenderedSteps.map(id => steps[id]) :
    [steps[currentStep.id]];

  renderedSteps.forEach(markStepAsRendered);

  currentStep = renderedSteps[renderedSteps.length - 1];

  if (cache && localStorage.getItem('rsc_cache')) {
    const data = JSON.parse(localStorage.getItem('rsc_cache'));
    const lastStep = data.renderedSteps[data.renderedSteps.length - 1];

    if (lastStep && lastStep.end) {
      localStorage.removeItem('rsc_cache');
    } else {
      for (let i = 0; i < data.renderedSteps.length; i += 1) {
        markStepAsRendered(data.renderedSteps[i]);
      }

      // execute callback function to enable input if last step is
      // waiting user type
      if (data.currentStep.user) {
        callback();
      }

      return data;
    }
  }

  return {
    currentStep,
    previousStep,
    previousSteps,
    renderedSteps,
  };
};

/* istanbul ignore next */
const setData = (data) => {
  localStorage.setItem('rsc_cache', JSON.stringify(data));
};

export {
  getData,
  setData,
};
