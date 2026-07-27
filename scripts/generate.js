#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function parseTarget(arg) {
  if (!arg) return { dir: '', name: '' };
  const parts = arg.split('/');
  if (parts.length === 1) {
    return { dir: '', name: parts[0] };
  }
  return { dir: parts.slice(0, -1).join('/'), name: parts[parts.length - 1] };
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATES = {
  feature: {
    index: (name) => {
      const pascal = toPascalCase(name);
      return `export { ${pascal}Navigator } from './navigation/${pascal}Navigator';
`;
    },
    navigator: (name) => {
      const pascal = toPascalCase(name);
      return `import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ${pascal}HomeScreen } from '../screens/${pascal}HomeScreen';

import type { ${pascal}StackParamList } from '../types';

const Stack = createNativeStackNavigator<${pascal}StackParamList>();

export function ${pascal}Navigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='${pascal}Home' component={${pascal}HomeScreen} />
    </Stack.Navigator>
  );
}
`;
    },
    screen: (name) => {
      const pascal = toPascalCase(name);
      return `import React from 'react';

import { StyleSheet, View } from 'react-native';

import { AppText, Button } from '@shared/components';

import type { ${pascal}ScreenProps } from '../types';

type Props = ${pascal}ScreenProps<'${pascal}Home'>;

export function ${pascal}HomeScreen({ navigation }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <AppText variant='h3' weight='semibold' className='mb-4'>
        ${pascal} Home Screen
      </AppText>
      <Button label='Go Back' onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
`;
    },
    types: (name) => {
      const pascal = toPascalCase(name);
      return `import type { NavigationProp, RouteProp } from '@react-navigation/native';

export type ${pascal}StackParamList = {
  ${pascal}Home: undefined;
};

export type ${pascal}NavigationProp<T extends keyof ${pascal}StackParamList> = NavigationProp<
  ${pascal}StackParamList,
  T
>;

export type ${pascal}RouteProp<T extends keyof ${pascal}StackParamList> = RouteProp<
  ${pascal}StackParamList,
  T
>;

export interface ${pascal}ScreenProps<T extends keyof ${pascal}StackParamList> {
  navigation: ${pascal}NavigationProp<T>;
  route: ${pascal}RouteProp<T>;
}
`;
    },
    api: (name) => {
      const pascal = toPascalCase(name);
      const camel = toCamelCase(name);
      return `import { baseApi } from '@core/api';

export const ${camel}Api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    get${pascal}Data: builder.query<{ id: string; name: string }, void>({
      query: () => '/${camel}',
      providesTags: ['Detail'],
    }),
  }),
});

export const { useGet${pascal}DataQuery } = ${camel}Api;
`;
    },
  },

  screen: (screenName, featureName) => {
    const pascalScreen = toPascalCase(screenName);
    const pascalFeature = toPascalCase(featureName);
    return `import React from 'react';

import { StyleSheet, View } from 'react-native';

import { AppText } from '@shared/components';

import type { ${pascalFeature}ScreenProps } from '../types';

type Props = ${pascalFeature}ScreenProps<'${pascalScreen}'>;

export function ${pascalScreen}Screen(_props: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <AppText variant='h3' weight='semibold'>
        ${pascalScreen} Screen
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
`;
  },

  component: (componentName) => {
    const pascal = toPascalCase(componentName);
    return `import React from 'react';

import { StyleSheet, View } from 'react-native';

import { AppText } from '@shared/components';

interface ${pascal}Props {
  title?: string;
}

export function ${pascal}({ title }: ${pascal}Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <AppText>{title || '${pascal} Component'}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
`;
  },

  hook: (hookName) => {
    const camel = toCamelCase(hookName);
    const nameWithoutUse = camel.startsWith('use') ? camel.slice(3) : camel;
    const hookNameFinal = 'use' + nameWithoutUse.charAt(0).toUpperCase() + nameWithoutUse.slice(1);
    return `import { useState, useCallback } from 'react';

export function ${hookNameFinal}() {
  const [value, setValue] = useState<boolean>(false);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return { value, toggle, setValue };
}
`;
  },

  api: (apiName) => {
    const pascal = toPascalCase(apiName);
    const camel = toCamelCase(apiName);
    return `import { baseApi } from '@core/api';

export const ${camel}Api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    get${pascal}: builder.query<unknown, string>({
      query: (id) => \`/${camel}/\${id}\`,
      providesTags: ['Detail'],
    }),
  }),
});

export const { useGet${pascal}Query } = ${camel}Api;
`;
  },

  slice: (sliceName) => {
    const camel = toCamelCase(sliceName);
    const pascal = toPascalCase(sliceName);
    return `import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ${pascal}State {
  data: unknown | null;
  loading: boolean;
}

const initialState: ${pascal}State = {
  data: null,
  loading: false,
};

export const ${camel}Slice = createSlice({
  name: '${camel}',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<unknown>) => {
      state.data = action.payload;
    },
    clearData: (state) => {
      state.data = null;
    },
  },
});

export const { setData, clearData } = ${camel}Slice.actions;

export default ${camel}Slice.reducer;
`;
  },

  form: (formName) => {
    const pascal = toPascalCase(formName);
    return `import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { AppText, Button, Input } from '@shared/components';

interface ${pascal}FormValues {
  name: string;
}

export function ${pascal}Form(): React.JSX.Element {
  const [values, setValues] = useState<${pascal}FormValues>({ name: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!values.name) {
      setError('Name is required');
      return;
    }
    setError(null);
    console.log('Submitted values:', values);
  };

  return (
    <View style={styles.container}>
      <Input
        label='Name'
        placeholder='Enter name'
        value={values.name}
        onChangeText={(text) => setValues({ name: text })}
        error={error ?? undefined}
      />
      <Button label='Submit' onPress={handleSubmit} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});
`;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Generators
// ─────────────────────────────────────────────────────────────────────────────

function generateFeature(targetName) {
  const name = targetName.toLowerCase();
  const pascal = toPascalCase(name);
  const featDir = path.join(ROOT, 'src', 'features', name);

  if (fs.existsSync(featDir)) {
    console.error(`✖ Feature "${name}" already exists.`);
    process.exit(1);
  }

  ensureDir(featDir);
  ensureDir(path.join(featDir, 'components'));
  ensureDir(path.join(featDir, 'hooks'));
  ensureDir(path.join(featDir, 'navigation'));
  ensureDir(path.join(featDir, 'screens'));
  ensureDir(path.join(featDir, 'types'));
  ensureDir(path.join(featDir, 'api'));

  fs.writeFileSync(path.join(featDir, 'index.ts'), TEMPLATES.feature.index(name), 'utf8');
  fs.writeFileSync(
    path.join(featDir, 'navigation', `${pascal}Navigator.tsx`),
    TEMPLATES.feature.navigator(name),
    'utf8',
  );
  fs.writeFileSync(
    path.join(featDir, 'screens', `${pascal}HomeScreen.tsx`),
    TEMPLATES.feature.screen(name),
    'utf8',
  );
  fs.writeFileSync(path.join(featDir, 'types', 'index.ts'), TEMPLATES.feature.types(name), 'utf8');
  fs.writeFileSync(
    path.join(featDir, 'api', `${name}.api.ts`),
    TEMPLATES.feature.api(name),
    'utf8',
  );

  fs.writeFileSync(path.join(featDir, 'components', '.gitkeep'), '', 'utf8');
  fs.writeFileSync(path.join(featDir, 'hooks', '.gitkeep'), '', 'utf8');

  console.log(`✅ Feature "${name}" scaffolded successfully at src/features/${name}`);
}

function generateScreen(targetArg) {
  const { dir: feature, name: screenName } = parseTarget(targetArg);
  if (!feature || !screenName) {
    console.error('✖ Screen generator expects "feature/ScreenName" format (e.g. auth/Login).');
    process.exit(1);
  }

  const featureDir = path.join(ROOT, 'src', 'features', feature.toLowerCase());
  if (!fs.existsSync(featureDir)) {
    console.error(`✖ Feature "${feature}" does not exist. Create the feature first.`);
    process.exit(1);
  }

  const pascalScreen = toPascalCase(screenName);
  const screenFile = path.join(featureDir, 'screens', `${pascalScreen}Screen.tsx`);
  if (fs.existsSync(screenFile)) {
    console.error(`✖ Screen "${pascalScreen}Screen" already exists in feature "${feature}".`);
    process.exit(1);
  }

  ensureDir(path.join(featureDir, 'screens'));
  fs.writeFileSync(screenFile, TEMPLATES.screen(screenName, feature), 'utf8');

  console.log(`✅ Screen "${pascalScreen}Screen" generated at src/features/${feature}/screens/`);
  console.log(
    `⚠ Make sure to add "${pascalScreen}" to the ${toPascalCase(feature)}StackParamList and the Navigator.`,
  );
}

function generateComponent(targetArg) {
  const { dir, name: componentName } = parseTarget(targetArg);
  const pascal = toPascalCase(componentName);

  if (dir === 'shared' || !dir) {
    // Shared component
    const compDir = path.join(ROOT, 'src', 'shared', 'components', pascal);
    if (fs.existsSync(compDir)) {
      console.error(`✖ Shared component "${pascal}" already exists.`);
      process.exit(1);
    }
    ensureDir(compDir);
    fs.writeFileSync(
      path.join(compDir, `${pascal}.tsx`),
      TEMPLATES.component(componentName),
      'utf8',
    );

    // Update shared barrel export
    const barrelFile = path.join(ROOT, 'src', 'shared', 'components', 'index.ts');
    let barrelContent = fs.readFileSync(barrelFile, 'utf8');
    barrelContent += `export { ${pascal} } from './${pascal}/${pascal}';\n`;
    fs.writeFileSync(barrelFile, barrelContent, 'utf8');

    console.log(`✅ Shared component "${pascal}" created at src/shared/components/`);
  } else {
    // Feature-specific component
    const featureDir = path.join(ROOT, 'src', 'features', dir.toLowerCase());
    if (!fs.existsSync(featureDir)) {
      console.error(`✖ Feature "${dir}" does not exist.`);
      process.exit(1);
    }
    const compDir = path.join(featureDir, 'components', pascal);
    if (fs.existsSync(compDir)) {
      console.error(`✖ Component "${pascal}" already exists in feature "${dir}".`);
      process.exit(1);
    }
    ensureDir(compDir);
    fs.writeFileSync(
      path.join(compDir, `${pascal}.tsx`),
      TEMPLATES.component(componentName),
      'utf8',
    );

    console.log(`✅ Component "${pascal}" created in feature "${dir}" components.`);
  }
}

function generateHook(targetArg) {
  const { dir, name: hookName } = parseTarget(targetArg);
  const camel = toCamelCase(hookName);
  const nameWithoutUse = camel.startsWith('use') ? camel.slice(3) : camel;
  const hookNameFinal = 'use' + nameWithoutUse.charAt(0).toUpperCase() + nameWithoutUse.slice(1);

  if (dir === 'shared' || !dir) {
    const hookFile = path.join(ROOT, 'src', 'shared', 'hooks', `${hookNameFinal}.ts`);
    if (fs.existsSync(hookFile)) {
      console.error(`✖ Shared hook "${hookNameFinal}" already exists.`);
      process.exit(1);
    }
    fs.writeFileSync(hookFile, TEMPLATES.hook(hookNameFinal), 'utf8');

    // Update shared barrel export
    const barrelFile = path.join(ROOT, 'src', 'shared', 'hooks', 'index.ts');
    let barrelContent = fs.readFileSync(barrelFile, 'utf8');
    barrelContent += `export { ${hookNameFinal} } from './${hookNameFinal}';\n`;
    fs.writeFileSync(barrelFile, barrelContent, 'utf8');

    console.log(`✅ Shared hook "${hookNameFinal}" created at src/shared/hooks/`);
  } else {
    const featureDir = path.join(ROOT, 'src', 'features', dir.toLowerCase());
    if (!fs.existsSync(featureDir)) {
      console.error(`✖ Feature "${dir}" does not exist.`);
      process.exit(1);
    }
    const hookFile = path.join(featureDir, 'hooks', `${hookNameFinal}.ts`);
    if (fs.existsSync(hookFile)) {
      console.error(`✖ Hook "${hookNameFinal}" already exists in feature "${dir}".`);
      process.exit(1);
    }
    ensureDir(path.join(featureDir, 'hooks'));
    fs.writeFileSync(hookFile, TEMPLATES.hook(hookNameFinal), 'utf8');

    console.log(`✅ Hook "${hookNameFinal}" created in feature "${dir}" hooks.`);
  }
}

function generateApi(targetArg) {
  const { dir: feature, name: apiName } = parseTarget(targetArg);
  if (!feature || !apiName) {
    console.error('✖ API generator expects "feature/apiName" format (e.g. auth/authDetails).');
    process.exit(1);
  }

  const featureDir = path.join(ROOT, 'src', 'features', feature.toLowerCase());
  if (!fs.existsSync(featureDir)) {
    console.error(`✖ Feature "${feature}" does not exist.`);
    process.exit(1);
  }

  const camelApi = toCamelCase(apiName);
  const apiFile = path.join(featureDir, 'api', `${camelApi}.api.ts`);
  if (fs.existsSync(apiFile)) {
    console.error(`✖ API file "${camelApi}.api.ts" already exists in feature "${feature}".`);
    process.exit(1);
  }

  ensureDir(path.join(featureDir, 'api'));
  fs.writeFileSync(apiFile, TEMPLATES.api(apiName), 'utf8');

  console.log(
    `✅ API endpoint injector "${camelApi}.api.ts" created in src/features/${feature}/api/`,
  );
}

function generateSlice(sliceName) {
  const camel = toCamelCase(sliceName);
  const sliceFile = path.join(ROOT, 'src', 'core', 'store', `${camel}Slice.ts`);

  if (fs.existsSync(sliceFile)) {
    console.error(`✖ Redux slice "${camel}Slice" already exists.`);
    process.exit(1);
  }

  fs.writeFileSync(sliceFile, TEMPLATES.slice(sliceName), 'utf8');

  console.log(`✅ Redux Slice "${camel}Slice" generated at src/core/store/`);
  console.log('⚠ Remember to add this slice reducer to RootState in src/core/store/store.ts.');
}

function generateForm(targetArg) {
  const { dir: feature, name: formName } = parseTarget(targetArg);
  if (!feature || !formName) {
    console.error('✖ Form generator expects "feature/FormName" format (e.g. auth/Login).');
    process.exit(1);
  }

  const featureDir = path.join(ROOT, 'src', 'features', feature.toLowerCase());
  if (!fs.existsSync(featureDir)) {
    console.error(`✖ Feature "${feature}" does not exist.`);
    process.exit(1);
  }

  const pascalForm = toPascalCase(formName);
  const formFile = path.join(featureDir, 'components', `${pascalForm}Form.tsx`);
  if (fs.existsSync(formFile)) {
    console.error(`✖ Form Component "${pascalForm}Form" already exists in feature "${feature}".`);
    process.exit(1);
  }

  ensureDir(path.join(featureDir, 'components'));
  fs.writeFileSync(formFile, TEMPLATES.form(formName), 'utf8');

  console.log(
    `✅ Form component "${pascalForm}Form" generated in src/features/${feature}/components/`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const type = args[0];
  const target = args[1];

  const allowedTypes = ['feature', 'screen', 'component', 'hook', 'api', 'slice', 'form'];

  if (!type || !allowedTypes.includes(type) || !target) {
    console.log('\nUsage: pnpm generate <type> <name>\n');
    console.log('Types:');
    console.log('  feature    <feature-name>           e.g. dashboard');
    console.log('  screen     <feature>/<screen-name>  e.g. auth/Login');
    console.log('  component  <feature|shared>/<name>  e.g. shared/Button');
    console.log('  hook       <feature|shared>/<name>  e.g. shared/useLock');
    console.log('  api        <feature>/<api-name>     e.g. profile/profileDetails');
    console.log('  slice      <slice-name>             e.g. settings');
    console.log('  form       <feature>/<form-name>    e.g. auth/Login');
    console.log('');
    process.exit(1);
  }

  switch (type) {
    case 'feature':
      generateFeature(target);
      break;
    case 'screen':
      generateScreen(target);
      break;
    case 'component':
      generateComponent(target);
      break;
    case 'hook':
      generateHook(target);
      break;
    case 'api':
      generateApi(target);
      break;
    case 'slice':
      generateSlice(target);
      break;
    case 'form':
      generateForm(target);
      break;
  }
}

main();
