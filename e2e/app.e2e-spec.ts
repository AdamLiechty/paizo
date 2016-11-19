import { PaizoPage } from './app.po';

describe('paizo App', function() {
  let page: PaizoPage;

  beforeEach(() => {
    page = new PaizoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
