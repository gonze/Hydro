import {
  Button, ControlGroup,
  Dialog, DialogBody, DialogFooter,
  Icon, InputGroup, Tag,
} from '@blueprintjs/core';
import { parseMemoryMB, parseTimeMS } from '@hydrooj/utils/lib/common';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { i18n } from 'vj/utils';
import { RootState } from '../reducer';

interface SubtaskSettingsProps {
  subtaskId: number;
  time: string;
  memory: string;
}

export function SubtaskSettings(props: SubtaskSettingsProps) {
  const [open, setOpen] = React.useState(false);
  const score = useSelector((state: RootState) => state.config.subtasks.find((i) => i.id === props.subtaskId).score);
  const time = useSelector((state: RootState) => state.config.subtasks.find((i) => i.id === props.subtaskId).time);
  const memory = useSelector((state: RootState) => state.config.subtasks.find((i) => i.id === props.subtaskId).memory);

  const [ctime, setTime] = React.useState(time);
  const [cmemory, setMemory] = React.useState(memory);
  const [cscore, setScore] = React.useState(score);
  const dispatcher = (func, key) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | number) => {
    let value = typeof ev !== 'object' ? ev : ev.currentTarget?.value;
    if (key === 'score') value = +value;
    func(value);
  };

  const dispatch = useDispatch();
  function onConfirm() {
    dispatch({
      type: 'problemconfig/updateSubtaskConfig',
      id: props.subtaskId,
      time: ctime,
      memory: cmemory,
      score: cscore,
    });
    setOpen(false);
  }

  return (<>
    <Dialog title={i18n('Set time and memory limits')} icon="cog" isOpen={open} onClose={() => setOpen(false)}>
      <DialogBody>
        <ControlGroup fill={true} vertical={false}>
          <InputGroup
            leftElement={<Icon icon="time" />}
            rightElement={<Tag minimal>ms</Tag>}
            onChange={(ev) => setTime(`${ev.currentTarget.value}ms`)}
            placeholder={`Inherit (${parseTimeMS(props.time, false) || '1000'})`}
            value={ctime ? parseTimeMS(ctime, false).toString() || '' : ''}
          />
          <InputGroup
            leftElement={<Icon icon="comparison" />}
            rightElement={<Tag minimal>MB</Tag>}
            onChange={(ev) => setMemory(`${ev.currentTarget.value}MB`)}
            placeholder={`Inherit (${parseMemoryMB(props.memory, false) || '256'})`}
            value={cmemory ? parseMemoryMB(cmemory, false).toString() || '' : ''}
          />
          <InputGroup
            leftElement={<Icon icon="star" />}
            onChange={dispatcher(setScore, 'score')}
            placeholder="Score"
            type="number"
            value={cscore.toString()}
          />
        </ControlGroup>
      </DialogBody>
      <DialogFooter actions={<Button className="primary rounded button" onClick={onConfirm} intent="primary" text="Save" />} />
    </Dialog>
    <li className="bp4-tree-node" onClick={() => setOpen(true)}>
      <div className="bp4-tree-node-content">
        <span className="bp4-tree-node-caret-none bp4-icon-standard"></span>
        <Icon icon="time" />
        &nbsp;&nbsp;
        <span className={`bp4-tree-node-label${time ? '' : ' text-gray'}`}>{time || props.time || '1s'}</span>
        <Icon icon="comparison" />
        &nbsp;&nbsp;
        <span className={`bp4-tree-node-label${memory ? '' : ' text-gray'}`}>{memory || props.memory || '256m'}</span>
        <Icon icon="star" />
        {' '}
        <span className="bp4-tree-node-secondary-label">{score || 0}</span>
      </div>
    </li>
  </>);
}

export function GlobalSettings() {
  const time = useSelector((s: RootState) => s.config?.time);
  const memory = useSelector((s: RootState) => s.config?.memory);
  const [open, setOpen] = React.useState(false);
  const [ctime, setTime] = React.useState(time);
  const [cmemory, setMemory] = React.useState(memory);
  React.useEffect(() => {
    setTime(time);
  }, [time]);
  React.useEffect(() => {
    setMemory(memory);
  }, [memory]);
  const dispatch = useDispatch();
  function onConfirm() {
    dispatch({
      type: 'problemconfig/updateGlobalConfig',
      time: ctime,
      memory: cmemory,
    });
    setOpen(false);
  }
  return (<>
    <Dialog title={i18n('Set time and memory limits')} icon="cog" isOpen={open} onClose={() => setOpen(false)}>
      <DialogBody>
        <ControlGroup fill={true} vertical={false}>
          <InputGroup
            leftElement={<Icon icon="time" />}
            rightElement={<Tag minimal>ms</Tag>}
            onChange={(ev) => setTime(`${ev.currentTarget.value}ms`)}
            placeholder="1000"
            value={ctime ? parseTimeMS(ctime, false).toString() || '' : ''}
          />
          <InputGroup
            leftElement={<Icon icon="comparison" />}
            rightElement={<Tag minimal>MB</Tag>}
            onChange={(ev) => setMemory(`${ev.currentTarget.value}MB`)}
            placeholder="256"
            value={cmemory ? parseMemoryMB(cmemory, false).toString() || '' : ''}
          />
        </ControlGroup>
      </DialogBody>
      <DialogFooter actions={<Button className="primary rounded button" onClick={onConfirm} intent="primary" text="Save" />} />
    </Dialog>
    <li className="bp4-tree-node" onClick={() => setOpen(true)}>
      <div className="bp4-tree-node-content">
        <Icon icon="time" />
        &nbsp;&nbsp;
        <span className={`bp4-tree-node-label${time ? '' : ' text-gray'}`}>{time || '1s'}</span>
        <Icon icon="comparison" />
        {' '}
        <span className={`bp4-tree-node-secondary-label${memory ? '' : ' text-gray'}`}>{memory || '256MB'}</span>
      </div>
    </li>
  </>);
}
