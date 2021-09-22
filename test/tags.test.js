const assert = require('chai').assert;
const tags   = require('../lib/tags');
const tf     = new tags.TagFactory();

describe('Tags', () => {
  describe('TagFactory', () => {

    it('should create tag 20 (TransactionReferenceNumber)', () => {
      const ref = 'REFERENCE';
      const tag = tf.createTag('20', null, ref);
      assert.equal(tag.fields.transactionReference, ref);
    });

    it('should create tag 21 (RelatedReference)', () => {
      const ref = 'REFERENCE';
      const tag = tf.createTag('21', null, ref);
      assert.equal(tag.fields.relatedReference, ref);
    });

    it('should create tag 25 (AccountIdentification)', () => {
      const account = '123456789';
      const tag = tf.createTag('25', null, account);
      assert.equal(tag.fields.accountIdentification, account);
    });

    it('should create tag 28 (StatementNumber)', () => {
      const str = '998/1';
      const tag = tf.createTag('28', null, str);
      assert.equal(tag.fields.statementNumber, '998');
      assert.equal(tag.fields.sequenceNumber,'1');
    });

    it('should create tag NS (NonSwift)', () => {
      const str = 'XYZ';
      const tag = tf.createTag('NS', null, str);
      assert.equal(tag.fields.nonSwift, 'XYZ');
    });

    it('should create tag 60 (OpeningBalance)', () => {
      const str = 'C160507EUR123,89';
      const tag = tf.createTag('60', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.currency,'EUR');
      assert.equal(tag.fields.amount, 123.89);
    });

    it('should create tag 62 (ClosingBalance)', () => {
      const str = 'C160507EUR123,89';
      const tag = tf.createTag('62', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.currency, 'EUR');
      assert.equal(tag.fields.amount, 123.89);
    });

    it('should create tag 64 (ClosingAvailableBalance)', () => {
      const str = 'C160507EUR123,89';
      const tag = tf.createTag('64', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.currency, 'EUR');
      assert.equal(tag.fields.amount, 123.89);
    });

    it('should create tag 65 (ForwardAvailableBalance)', () => {
      const str = 'C160507EUR123,89';
      const tag = tf.createTag('65', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.currency, 'EUR');
      assert.equal(tag.fields.amount, 123.89);
    });

    it('should create tag 61 (StatementLine)', () => {
      const str = '1605070507D123,89NTRFNONREF//B4E07XM00J000023';
      const tag = tf.createTag('61', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.entryDate.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.amount, -123.89);
      assert.equal(tag.fields.transactionType, 'NTRF');
      assert.equal(tag.fields.reference, 'NONREF');
      assert.equal(tag.fields.bankReference, 'B4E07XM00J000023');
      assert.equal(tag.fields.isReversal, false);
    });

    it('should create tag 61 / reversal and funds code', () => {
      const str = '1605070507RDR123,89NTRFNONREF//B4E07XM00J000023';
      const tag = tf.createTag('61', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.entryDate.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.amount, 123.89); // Reversed
      assert.equal(tag.fields.transactionType, 'NTRF');
      assert.equal(tag.fields.reference, 'NONREF');
      assert.equal(tag.fields.bankReference, 'B4E07XM00J000023');
      assert.equal(tag.fields.isReversal, true);
      assert.equal(tag.fields.fundsCode, 'R');
    });

    it('should create tag 61 (with extraDetails)', () => {
      const str = '1605070507D123,89NTRFNONREF//B4E07XM00J000023\nSUPPLEMENTARY_DETAILS';
      const tag = tf.createTag('61', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.entryDate.toISOString().substr(0,10), '2016-05-07');
      assert.equal(tag.fields.amount, -123.89);
      assert.equal(tag.fields.transactionType, 'NTRF');
      assert.equal(tag.fields.reference, 'NONREF');
      assert.equal(tag.fields.bankReference, 'B4E07XM00J000023');
      assert.equal(tag.fields.isReversal, false);
      assert.equal(tag.fields.extraDetails, 'SUPPLEMENTARY_DETAILS');
    });

    it('should create tag 61 (with extraDetails, but no bankRef)', () => {
      const str = '170406D000000001001,69N541NONREF\nNL72RABO0104510633';
      const tag = tf.createTag('61', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2017-04-06');
      assert.equal(tag.fields.isReversal, false);
      assert.equal(tag.fields.amount, -1001.69);
      assert.equal(tag.fields.transactionType, 'N541');
      assert.equal(tag.fields.reference, 'NONREF');
      assert.equal(tag.fields.extraDetails, 'NL72RABO0104510633');
    });

    it('should create tag 61 (with correct entryDate from previous year)', () => {
      const str = '2101011230CR0,00NCHGNONREF';
      const tag = tf.createTag('61', null, str);
      assert.equal(tag.fields.date.toISOString().substr(0,10), '2021-01-01');
      assert.equal(tag.fields.entryDate.toISOString().substr(0,10), '2020-12-30');
      assert.equal(tag.fields.amount, 0.00);
    });

    it('should create tag 86 (TransactionDetails)', () => {
      const str = 'Some text here';
      const tag = tf.createTag('86', null, str);
      assert.equal(tag.fields.transactionDetails, 'Some text here');
    });

    it('should create tag with a subId', () => {
      const str = '998/1';
      const tag = tf.createTag('28', 'C', str);
      assert.equal(tag.fields.statementNumber, '998');
      assert.equal(tag.fields.sequenceNumber, '1');
    });

    it('should throw unknown tag', () => {
      const str = 'Some data';
      assert.throws(
        tf.createTag.bind(tf, 'XX', null, str),
        /Unknown tag/);
    });

    it('should throw wrong content', () => {
      const str = 'Some data';
      assert.throws(
        tf.createTag.bind(tf, '28', null, str),
        /Cannot parse/);
    });
  });
  describe('Tags', () => {

    it('Tag and TagBalance are abstact', () => {
      assert.throws(
        () => new tags.Tag,
        /Tag instances/);
      assert.throws(
        () => new tags.TagBalance('C160507EUR123,89'),
        /TagBalance instances/);
    });

  });
});
