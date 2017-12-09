import { IO, Element } from './templates';

export default (ioDTOs, targetType) => IO(ioDTOs.map(Element), targetType);
