import { HomeComponent } from "./home.component";

describe('Home', () => {
  it('create an instance', () => {
    const home = new HomeComponent();
    expect(home).toBeTruthy();
  });
});
