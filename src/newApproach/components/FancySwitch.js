import React from 'react';
import styled from 'styled-components';
import '../styles/variables.css';

// Wykorzystanie zmiennych CSS w styled-components
const SwitchContainer = styled.div`
  display: flex;
  background-color: #f1f5f9;
  border-radius: 30px;
  padding: 4px;
  position: relative;
  width: fit-content;
`;

const Option = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 26px;
  position: relative;
  z-index: 1;
  font-weight: 500;
  min-width: 150px;
  text-align: center;
  transition: color 0.2s;
  color: ${props => props.active ? '#fff' : '#64748b'};
`;

const Slider = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: var(--primary-color, '#018249');
  border-radius: 26px;
  height: calc(100% - 8px);
  transition: transform 0.3s ease-in-out;
  width: calc(50% - 4px);
  transform: translateX(${props => props.position === 0 ? '0' : '100%'});
`;

export const FancySwitch = ({ options, value, onChange }) => {
  const handleClick = (optionValue) => {
    onChange(optionValue);
  };

  const activeIndex = options.findIndex(option => option.value === value);

  return (
    <SwitchContainer>
      <Slider position={activeIndex} />
      {options.map((option, index) => (
        <Option
          key={option.value}
          active={value === option.value}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </Option>
      ))}
    </SwitchContainer>
  );
};

export default FancySwitch;