/**
 * Verification Service
 * Simulates integration with UIDAI, CCTNS, and PFMS
 * In production, these would be actual API calls to government gateways
 */

export const verifyAadhaar = async (aadhaar: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simple validation: 12 digits
  const cleaned = aadhaar.replace(/-/g, '');
  return /^\d{12}$/.test(cleaned);
};

export const fetchCCTNSData = async (firNumber: string): Promise<any> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  if (!firNumber) return null;

  // Simulated FIR Record
  return {
    firId: firNumber,
    sections: ['3(1)(r)', '3(1)(s)', 'SC/ST Act'],
    incidentDate: new Date().toISOString().split('T')[0],
    status: 'Charge-sheeted',
    complainant: 'Verified Profile Match',
    accusedNames: ['Rahul S.', 'Unknown'],
    narrative:
      'The victim was subjected to public humiliation and verbal abuse based on caste identity in a marketplace environment.',
  };
};

export const initiatePFMSTransfer = async (
  beneficiaryId: string,
  amount: number
): Promise<{
  utrNumber: string;
  timestamp: string;
  status: string;
}> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  return {
    utrNumber: `PFMS${Math.floor(Math.random() * 1000000000)}`,
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
  };
};

export const verifyBankAccount = async (
  accountNumber: string,
  ifsc: string
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Basic validation
  return accountNumber.length >= 9 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};
