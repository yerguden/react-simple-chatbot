import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from '../common/Loading';
import CustomStepContainer from './CustomStepContainer';

class CustomStep extends Component {
  /* istanbul ignore next */
  constructor(props) {
    super(props);

    this.state = {
      // dont enter loading if delay isn't specified
      loading: Boolean(props.step.delay),
    };

    this.renderComponent = this.renderComponent.bind(this);
  }

  componentDidMount() {
    const { step } = this.props;
    const { delay, waitAction } = step;

    if (!delay) {
      if (!waitAction && !step.rendered) {
        // call next step immeadiately if there is no delay
        this.props.triggerNextStep();
      }
    } else {
      setTimeout(() => {
        this.setState({ loading: false }, () => {
          if (!waitAction && !step.rendered) {
            this.props.triggerNextStep();
          }
        });
      }, delay);
    }
  }

  renderComponent() {
    const { step, steps, previousStep, triggerNextStep } = this.props;
    const { component } = step;
    return React.cloneElement(component, {
      step,
      steps,
      previousStep,
      triggerNextStep,
    });
  }

  render() {
    const { loading } = this.state;
    const { style } = this.props;

    return (
      <CustomStepContainer
        className="rsc-cs"
        style={style}
      >
        {
          loading ? (
            <Loading />
          ) : this.renderComponent()
        }
      </CustomStepContainer>
    );
  }
}

CustomStep.propTypes = {
  step: PropTypes.object.isRequired,
  steps: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  previousStep: PropTypes.object.isRequired,
  triggerNextStep: PropTypes.func.isRequired,
};

export default CustomStep;
