import {expect, test} from '@playwright/test';

const dailyLiturgy = {
  date: '2026-11-08',
  title: '32º Domingo do Tempo Comum',
  color: 'GREEN',
  prayers: {},
  groups: [{kind: 'GOSPEL', items: [{title: 'Evangelho', reference: 'Mt 25,1-13', text: 'Naquele tempo, disse Jesus esta parábola.'}]}],
  source: {provider: 'CNBB', fetchedAt: '2026-11-08T12:00:00-03:00', freshness: 'LIVE'},
};

const reflection = {
  text: 'O óleo é o amor que não se pode comprar, mas que recebemos como dom.',
  attribution: 'Papa Bento XVI, Angelus de 6 de novembro de 2011',
  reference: 'Mt 25,1-13',
};

function mockLiturgy(body: unknown) {
  return (route: import('@playwright/test').Route) => route.fulfill({json: body as object});
}

test('liturgy renders the reflection after the Gospel when the API provides one', async ({page}) => {
  await page.clock.setFixedTime(new Date('2026-11-08T15:00:00Z'));
  await page.route('**/liturgy/today**', mockLiturgy({...dailyLiturgy, reflection}));
  await page.goto('/pt/liturgy');

  const section = page.locator('#reflexao');
  await expect(section).toBeVisible();
  await expect(section).toContainText('O óleo é o amor que não se pode comprar, mas que recebemos como dom.');
  await expect(section.locator('.reflection-attribution')).toContainText('Papa Bento XVI, Angelus de 6 de novembro de 2011');
  await expect(section.locator('.reflection-attribution')).toContainText('Mt 25,1-13');
  await expect(page.locator('.contents-nav').getByRole('link', {name: 'Reflexão'})).toBeVisible();

  const gospelBox = await page.locator('.reading-group-gospel').boundingBox();
  const reflectionBox = await section.boundingBox();
  expect(reflectionBox!.y).toBeGreaterThan(gospelBox!.y);
});

test('liturgy silently omits the reflection section when the API has none', async ({page}) => {
  await page.clock.setFixedTime(new Date('2026-11-08T15:00:00Z'));
  await page.route('**/liturgy/today**', mockLiturgy(dailyLiturgy));
  await page.goto('/pt/liturgy');

  await expect(page.locator('.reading-group-gospel')).toBeVisible();
  await expect(page.locator('#reflexao')).toHaveCount(0);
  await expect(page.locator('.contents-nav').getByRole('link', {name: 'Reflexão'})).toHaveCount(0);
});

test('admin gate rejects a wrong token and completes a save round-trip', async ({page}) => {
  await page.clock.setFixedTime(new Date('2026-11-08T15:00:00Z'));
  await page.route('**/liturgy/today**', mockLiturgy(dailyLiturgy));
  await page.route('**/internal/v1/reflections**', async (route) => {
    const request = route.request();
    if (request.headers()['authorization'] !== 'Bearer segredo') {
      return route.fulfill({status: 403, json: {message: 'forbidden'}});
    }
    if (request.method() === 'GET') return route.fulfill({json: {reflections: []}});
    if (request.method() === 'PUT') {
      const body = request.postDataJSON() as {text: string; attribution: string; reference?: string};
      return route.fulfill({json: {date: '2026-11-08', ...body, updatedAt: '2026-11-08T12:00:00Z'}});
    }
    return route.fulfill({status: 204});
  });

  await page.goto('/pt/admin/reflexoes');
  await expect(page.getByRole('heading', {level: 1, name: 'Reflexões da liturgia'})).toBeVisible();

  await page.locator('#admin-token').fill('errado');
  await page.getByRole('button', {name: 'Entrar'}).click();
  await expect(page.locator('p[role="alert"]')).toContainText(/chave não foi aceita/i);

  await page.locator('#admin-token').fill('segredo');
  await page.getByRole('button', {name: 'Entrar'}).click();
  await expect(page.locator('#reflection-text')).toBeVisible();
  await expect(page.getByText('Evangelho de hoje: Mt 25,1-13')).toBeVisible();

  await page.locator('#reflection-text').fill(reflection.text);
  await page.locator('#reflection-attribution').fill(reflection.attribution);
  await expect(page.locator('.admin-preview')).toContainText('O óleo é o amor');
  await page.getByRole('button', {name: 'Salvar reflexão'}).click();
  await expect(page.getByRole('status').filter({hasText: 'Reflexão salva.'})).toBeVisible();
});
