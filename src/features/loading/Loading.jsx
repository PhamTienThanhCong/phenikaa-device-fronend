import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePromiseTracker } from "react-promise-tracker";
import "./Loading.scss";
import { Spin } from "antd";

function Loading() {
  const { promiseInProgress } = usePromiseTracker({ delay: 1000 });

  const value = useSelector((state) => state.loading.value);
  const timer = useSelector((state) => state.loading.timer);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      let timeout = null;
      if (value) {
        timeout = setTimeout(() => {
          return setIsShow(true);
        }, timer);
      } else {
        setIsShow(false);
      }
      return () => {
        clearTimeout(timeout);
      };
    } else {
      setIsShow(value);
    }
  }, [value, timer]);

  const _onContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const _onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "none";
    e.dataTransfer.dropEffect = "none";
  };

  const _render = () => {
    return (
      <div
        style={{
          zIndex: 9999,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "fixed",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
        id="loading-container"
        onContextMenu={_onContextMenu}
        onDragOver={_onDragOver}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
          <div style={{ textAlign: "center", color: "white", paddingTop: "16px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>Loading</div>
          </div>
        </div>
      </div>
    );
  };
  return promiseInProgress ? _render() : isShow && _render();
}

export default Loading;
