import { NotFoundException } from '@nestjs/common';
import { ErrorCodes, ErrorMessages } from '../errors/codes.error';

// Throws a NotFoundException if a mongoose query returns null document
export function ThrowNotFoundIfNull(value?: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      if (result === null) {
        if (value)
          throw new NotFoundException(
            ErrorCodes[value],
            ErrorMessages[ErrorCodes[value]],
          );

        throw new NotFoundException();
      }

      return result;
    };
  };
}
