import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StudentManagementModule", (m) => {
  const studentManagement = m.contract("StudentManagement");

  return { studentManagement };
});

