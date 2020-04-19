import React from "react";
// UI Components
import {
  ButtonGroup,
  Button,
  SvgIcon,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem
} from "@material-ui/core";
// Icons
import { mdiMenuDown } from "@mdi/js";
// Types
import { MrStates } from "../controllers/mergeRequests.types";
// Hooks
import { useMenu } from "./controllers/useMenu";

interface StateMenuProps {
  selectedMrState: MrStates;
  selectMrState: (mrState: MrStates) => void;
}
const StateMenu = ({ selectedMrState, selectMrState }: StateMenuProps) => {
  const { open, toggleMenu, anchorRef, handleClose } = useMenu();

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="mr-state-button"
      >
        <Button>{selectedMrState}</Button>
        <Button
          // color="primary"
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge request state"
          aria-haspopup="menu"
          onClick={toggleMenu}
        >
          <SvgIcon>
            <path d={mdiMenuDown} />
          </SvgIcon>
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom"
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="mr-state-button-menu">
                  {(["Opened", "Closed", "Merged", "Locked", "All"] as Array<
                    keyof typeof MrStates
                  >).map(
                    (key): JSX.Element => (
                      <MenuItem
                        key={key}
                        selected={selectedMrState === MrStates[key]}
                        onClick={(): void => {
                          selectMrState(MrStates[key]);
                          toggleMenu();
                        }}
                      >
                        {MrStates[key].charAt(0) +
                          MrStates[key].slice(1).toLowerCase()}
                      </MenuItem>
                    )
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default StateMenu;
