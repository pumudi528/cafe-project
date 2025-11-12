export class CreateCustomerDto {
  firstName: string;
  lastName: string;
  contactNumber: string;
  password: string; // will be hashed
  address: {
    houseNumber: string;
    lane1: string;
    lane2?: string;
    city: string;
    postalCode: string;
  };
}
