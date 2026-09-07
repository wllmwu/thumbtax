import React from "react";

import { useStore } from "#src/state/useStore";
import { FormList } from "#src/ui/forms/FormList";
import { LoadErrorBanner } from "#src/ui/forms/LoadErrorBanner";
import { Page } from "#src/ui/pages/Page";
import { Link } from "#src/ui/primitives/Link";
import { LinkButton } from "#src/ui/primitives/LinkButton";

import type { TableOfContentsHeading } from "#src/ui/types/tableOfContentsHeading";

function GetStarted() {
  return (
    <div>
      <h2>Get started</h2>
      <p>
        Use the income builder to model your income for the year. Thumbtax will
        automatically calculate the tax forms you would file.
      </p>
      <p>
        Afterward, you can adjust the forms yourself or reopen the income
        builder.
      </p>
      <LinkButton href="/income-builder" variant="primary">
        Launch income builder
      </LinkButton>
    </div>
  );
}

export function MainPage() {
  const formClasses = useStore((state) => state.applicationState.formClasses);
  const formInstances = useStore(
    (state) => state.applicationState.formInstances,
  );
  const specifications = useStore((state) => state.specifications);

  const headings = React.useMemo<TableOfContentsHeading[]>(() => {
    if (!specifications) {
      return [];
    }
    return formClasses
      .filter((formClass) => formInstances[formClass] !== undefined)
      .map((formClass) => ({
        id: formClass,
        label: specifications[formClass].title,
      }));
  }, [formClasses, formInstances, specifications]);

  return (
    <Page headings={headings} header={<h1>Tax forms</h1>}>
      <LoadErrorBanner />
      <p>
        Welcome to Thumbtax, a tool for estimating your U.S. individual tax
        return and learning about the tax return process. By using Thumbtax, you
        agree to the <Link href="/terms">terms of service</Link> and{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>
      {formClasses.length === 0 ? (
        <GetStarted />
      ) : (
        <aside>
          <LinkButton href="/income-builder">Launch income builder</LinkButton>
        </aside>
      )}
      <FormList />
    </Page>
  );
}
