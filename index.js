import React, { useState, useEffect } from "react";
import { View, Image, Dimensions, PanResponder } from "react-native";

const deviceWidth = Dimensions.get("window").width;

const Before = (props) => (
  <View style={{ flex: 1 }}>
    <View
      style={{
        top: 0,
        left: 0,
        overflow: "hidden",
        position: "absolute",
        width: props.state.width,
        height: props.state.height,
      }}
    >
      {props.children}
    </View>
  </View>
);

const After = (props) => (
  <View
    style={{
      top: 0,
      flex: 1,
      right: 0,
      bottom: 0,
      zIndex: 9,
      overflow: "hidden",
      position: "absolute",
      left: props.state.left,
    }}
  >
    <View
      style={{
        top: 0,
        right: 0,
        position: "absolute",
        width: props.state.width,
        height: props.state.height,
      }}
    >
      {props.children}
    </View>
  </View>
);

const DefaultDragger = (props) => (
  <View
    {...props.parent._panResponder.panHandlers}
    style={{
      top: 0,
      zIndex: 10,
      position: "absolute",
      left: props.state.left,
      height: props.state.height,
      backgroundColor: "transparent",
      width: props.state.draggerWidth,
      marginLeft: -props.state.draggerWidth / 2,
    }}
  >
    <View
      style={{
        width: 50,
        height: 50,
        opacity: 0.6,
        borderRadius: 25,
        overflow: "hidden",
        backgroundColor: "#FFF",
        marginTop: props.state.height / 2 - 25,
      }}
    >
      <Image
        source={require("./arrows.png")}
        style={{ width: 40, height: 40, margin: 5 }}
      />
    </View>
  </View>
);

const Dragger = (props) => (
  <View
    {...props.parent._panResponder.panHandlers}
    style={{
      top: 0,
      zIndex: 10,
      position: "absolute",
      left: props.state.left,
      height: props.state.height,
      width: props.state.draggerWidth,
      marginLeft: -props.state.draggerWidth / 2,
    }}
  >
    {props.children}
  </View>
);

export default function Compare(props) {
  const initial = props.initial ? props.initial : 0;
  const containerStyle = props.containerStyle ?? {};
  const width = props.width ? props.width : deviceWidth;
  const onMove = props.onMove ? props.onMove : () => {};
  const height = props.height ? props.height : width / 2;
  const backgroundColor = props?.backgroundColor ?? "#f2f2f2";
  const onMoveEnd = props.onMoveEnd ? props.onMoveEnd : () => {};
  const onMoveStart = props.onMoveStart ? props.onMoveStart : () => {};
  const draggerWidth =
    props.draggerWidth || props.draggerWidth == 0 ? props.draggerWidth : 50;

  const [state, setState] = useState({
    width,
    dx: 0,
    height,
    onMove,
    onMoveEnd,
    onMoveStart,
    draggerWidth,
    leftExtra: 0,
    left: initial,
    currentLeft: initial,
  });
  const [exa, setExa] = useState(1);
  const [parent, setParent] = useState({ _panResponder: () => {} });
  let tempLeft;

  useEffect(() => {
    setParent({
      _panResponder: PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,

        onPanResponderGrant: (e, gestureState) => {
          setState({ ...state, dx: 0 });
          state.onMoveStart();
        },
        tempLeft: 0,
        onPanResponderMove: (event, gestureState) => {
          let dx = gestureState.dx;

          let left = state.currentLeft + dx;

          let { width, draggerWidth } = state;

          if (left < 0) left = 0;
          else if (left >= width) left = width;

          tempLeft = left;

          setState({ ...state, left: left });
          setExa(exa + 1);
          state.onMove();
        },
        onPanResponderRelease: (e, { vx, vy }) => {
          state.onMoveEnd();
          setState({ ...state, currentLeft: tempLeft, left: tempLeft });
        },
      }),
    });
  }, [props, state.currentLeft]);

  const renderChildren = (props, state) => {
    return React.Children.map(props.children, (child) => {
      return React.cloneElement(child, {
        state,
        parent: parent,
      });
    });
  };

  const { children } = props;

  return (
    <View style={{ width, height, backgroundColor, ...containerStyle }}>
      {renderChildren(props, state)}
    </View>
  );
}

export { Before, After, DefaultDragger, Dragger };
