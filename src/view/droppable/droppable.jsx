import React, { Component } from 'react';
import PropTypes from 'prop-types';
import type { Props, Provided, StateSnapshot, DefaultProps } from './droppable-types';
import type { DroppableId, HTMLElement } from '../../types';
import DroppableDimensionPublisher from '../droppable-dimension-publisher/';
import Placeholder from '../placeholder/';
import { droppableIdKey } from '../context-keys';

type State = {|
  ref: ?HTMLElement,
|}

type Context = {|
  [droppableIdKey]: DroppableId
|}

export default class Droppable extends Component {
  /* eslint-disable react/sort-comp */
  props: Props
  state: State

  state: State = {
    ref: null,
  }

  static defaultProps: DefaultProps = {
    type: 'DEFAULT',
    ignoreContainerClipping: false,
    isDropDisabled: false,
    direction: 'vertical',
  }

  // Need to declare childContextTypes without flow
  // https://github.com/brigand/babel-plugin-flow-react-proptypes/issues/22
  static childContextTypes = {
    [droppableIdKey]: PropTypes.string.isRequired,
  }

  getChildContext(): Context {
    const value: Context = {
      [droppableIdKey]: this.props.droppableId,
    };
    return value;
  }
  /* eslint-enable */

  // React calls ref callback twice for every render
  // https://github.com/facebook/react/pull/8333/files
  setRef = (ref: ?HTMLElement) => {
    // TODO: need to clear this.state.ref on unmount
    if (ref === null) {
      return;
    }

    if (ref === this.state.ref) {
      return;
    }

    // need to trigger a child render when ref changes
    this.setState({
      ref,
    });
  }

  getPlaceholder() {
    if (!this.props.placeholder) {
      return null;
    }

    return (
      <Placeholder
        height={this.props.placeholder.height}
        width={this.props.placeholder.width}
      />
    );
  }

  render() {
    const {
      children,
      direction,
      droppableId,
      ignoreContainerClipping,
      isDraggingOver,
      isDropDisabled,
      type,
    } = this.props;
    const provided: Provided = {
      innerRef: this.setRef,
      placeholder: this.getPlaceholder(),
    };
    const snapshot: StateSnapshot = {
      isDraggingOver,
    };

    return (
      <DroppableDimensionPublisher
        droppableId={droppableId}
        direction={direction}
        ignoreContainerClipping={ignoreContainerClipping}
        isDropDisabled={isDropDisabled}
        type={type}
        targetRef={this.state.ref}
      >
        {children(provided, snapshot)}
      </DroppableDimensionPublisher>
    );
  }
}
