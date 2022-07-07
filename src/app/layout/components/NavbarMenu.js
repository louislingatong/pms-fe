import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Inputs} from 'adminlte-2-react';
import {resetAuth, logoutAsync} from '../../store/authSlice';
import {resetEmployee} from '../../store/employeeSlice';
import {resetInterval} from '../../store/intervalSlice';
import {resetMachinery} from '../../store/machinerySlice';
import {resetOption} from '../../store/optionSlice';
import {resetPermission} from '../../store/permissionSlice';
import {resetProfile} from '../../store/profileSlice';
import {resetRunningHour} from '../../store/runningHourSlice';
import {resetVesselMachinery} from '../../store/vesselMachinerySlice';
import {resetVessel} from '../../store/vesselSlice';
import {resetWork} from '../../store/workSlice';
import {Entry} from '../../components';
import {
  activeVesselSubMenu,
  reqVesselSubMenusStatus,
  setSelectedVessel,
  vesselListAsync,
  vesselSubMenus,
  resetNavbarMenu
} from '../../store/navbarMenuSlice';
import {useDebounce} from '../../utils/Hooks';
import Vessel from '../../core/models/Vessel';

function NavbarMenu() {
  const {Text} = Inputs;

  const dispatch = useDispatch();

  const vessels = useSelector(vesselSubMenus);
  const activeVessel = useSelector(activeVesselSubMenu);
  const vesselsStatus = useSelector(reqVesselSubMenusStatus);

  const [localVessels, setLocalVessels] = useState([]);
  const [localActiveVessel, setLocalActiveVessel] = useState(new Vessel());
  const [vesselSearchString, setVesselSearchString] = useState();

  const debouncedVesselSearchString = useDebounce(vesselSearchString, 1000);

  useEffect(() => {
    if (!vessels.length) {
      initVessels();
    }
    if (vessels.length && localVessels && !localVessels.length) {
      setLocalVessels(vessels);
    }
  }, [vessels, localVessels]);

  useEffect(() => {
    if (localActiveVessel && localActiveVessel.id !== activeVessel.id) {
      setLocalActiveVessel(activeVessel);
    }
  }, [localActiveVessel, activeVessel]);

  useEffect(() => {
    if (debouncedVesselSearchString !== undefined) {
      handleSearchVessel();
    }
  }, [debouncedVesselSearchString]);

  const handleSearchVesselChange = (e) => {
    setVesselSearchString(e.target.value);
  };

  const handleSearchVessel = () => {
    const params = !!vesselSearchString ? {keyword: vesselSearchString} : {};
    initVessels(params);
  }

  const initVessels = (params = {}) => {
    dispatch(vesselListAsync(params));
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
    dispatch(resetAuth());
    dispatch(resetEmployee());
    dispatch(resetInterval());
    dispatch(resetMachinery());
    dispatch(resetNavbarMenu());
    dispatch(resetOption());
    dispatch(resetPermission());
    dispatch(resetProfile());
    dispatch(resetRunningHour());
    dispatch(resetVesselMachinery());
    dispatch(resetVessel());
    dispatch(resetWork());
  }

  return (
    <React.Fragment>
      <Entry
        className="tasks-menu"
        icon="fa-ship"
        label={activeVessel.name}
        header={
          <Text
            name="search"
            id="searchVesselInput"
            labelPosition="none"
            placeholder="Search vessel"
            onChange={handleSearchVesselChange}
          />
        }
        footer={<Link to="/vessels">see all vessels</Link>}
      >
        {
          vessels && vessels.map(vessel => (
            <li key={vessel.id} className="task-item">
              <a href="javascript:" onClick={() => dispatch(setSelectedVessel(vessel))}>{vessel.name}</a>
            </li>
          ))
        }
      </Entry>
      <Entry
        icon="fa-power-off"
        onClick={handleLogout}
      />
    </React.Fragment>
  );
}

export default NavbarMenu;
