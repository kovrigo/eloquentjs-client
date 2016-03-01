import sinon from 'sinon';
import 'sinon-as-promised';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
chai.use(chaiAsPromised);

import './BuilderTest';
import './Connection/RestfulJsonConnectionTest';
import './ModelTest';

import './IntegrationTest';
