import classNames from "classnames";

type ClassNameFunction = ({
  defaultClassName,
}: {
  defaultClassName: string | undefined;
}) => string;

/**
 * "React Aria className."
 *
 * Returns a function that concatenates the given className string(s) with the default className from a React Aria component.
 */
export function racn(...classes: Array<string | undefined>): ClassNameFunction {
  return ({ defaultClassName }) => classNames(defaultClassName, ...classes);
}
