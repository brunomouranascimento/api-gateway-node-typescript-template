import { resolve } from 'path';
import { promises as fsPromises } from 'fs';
import { Gateway } from '../interfaces/gateway';

const serverConfig = async () => {
  try {
    const pathFile = resolve(process.cwd(), 'config.json');
    const readYaml = await fsPromises.readFile(pathFile, 'utf8');
    const config = JSON.parse(readYaml)
    if (!config.services) {
      throw new Error();
    }
    return setSettings(config);
  } catch (error) {
    throw new Error(
      'Check if there is a services.json file and if there is a configuration of the services',
    );
  }
};

const setSettings = ({
  name,
  host,
  config,
  security,
  services,
}: Gateway): Gateway => {
  const setName = () => {
    if (name) {
      return name;
    }
    return process.env.npm_package_name || '';
  };

  const setBoolean = (parentProperty: unknown, property: string) => {
    if (parentProperty === undefined || parentProperty === null) {
      return true;
    }

    if (
      parentProperty[property] === undefined ||
      parentProperty[property] === null
    ) {
      return true;
    }

    return parentProperty[property];
  };

  return {
    name: setName(),
    host: host || '',
    config: {
      morgan: setBoolean(config, 'morgan'),
      port: (config && config.port) || 3333,
    },
    security: {
      helmet: setBoolean(security, 'helmet'),
      json: setBoolean(security, 'json'),
    },
    services,
  };
};

export { serverConfig };
