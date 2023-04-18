import { Hydrator } from './hydrator';

describe('Hydrator', () => {
  let hydrator: Hydrator;

  beforeEach(() => {
    hydrator = new Hydrator();
  });

  describe('extract', () => {
    it('should throw an error if object is undefined', () => {
      expect(() => hydrator.extract(undefined)).toThrow(
        'Invalid object provided to extract: undefined',
      );
    });

    it('should throw an error if object has no toJSON method', () => {
      const obj = { foo: 'bar' };
      expect(() => hydrator.extract(obj as any)).toThrow(
        `Invalid object provided to extract: ${obj}`,
      );
    });

    it('should return the result of calling toJSON on the object', () => {
      const obj = { toJSON: () => ({ foo: 'bar' }) };
      expect(hydrator.extract(obj)).toEqual({ foo: 'bar' });
    });
  });

  describe('hydrate', () => {
    it('should throw an error if object is undefined', () => {
      const data = { foo: 'bar' };
      expect(() => hydrator.hydrate(data, undefined)).toThrow(
        `Invalid data or object provided to hydrate: data=${data}, object=undefined`,
      );
    });

    it('should throw an error if data is not a plain object', () => {
      const data = ['foo', 'bar'];
      const obj = { fromJSON: jest.fn() };
      expect(() => hydrator.hydrate(data, obj)).toThrow(
        `Invalid data or object provided to hydrate: data=${data}, object=${obj}`,
      );
    });

    it('should throw an error if object has no fromJSON method', () => {
      const data = { foo: 'bar' };
      const obj = { bar: 'baz' };
      expect(() => hydrator.hydrate(data, obj as any)).toThrow(
        `Invalid data or object provided to hydrate: data=${data}, object=${obj}`,
      );
    });

    it('should call fromJSON on the object with the given data', () => {
      const data = { foo: 'bar' };
      const obj = { fromJSON: jest.fn() };
      hydrator.hydrate(data, obj);
      expect(obj.fromJSON).toHaveBeenCalledWith(data);
    });

    it('should return the object after hydrating it', () => {
      const data = { foo: 'bar' };
      const obj = { fromJSON: jest.fn() };
      expect(hydrator.hydrate(data, obj)).toBe(obj);
    });
  });
});
