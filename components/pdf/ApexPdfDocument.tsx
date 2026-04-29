import { Circle, Document, G, Line, Page, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";

import { ApexProject } from "@/lib/projectSchema";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#0A2540",
    backgroundColor: "#ffffff",
  },
  coverTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 10,
    color: "#0A2540",
  },
  coverSubtitle: {
    fontSize: 11,
    color: "#4B5563",
    marginBottom: 5,
  },
  redBar: {
    width: 64,
    height: 5,
    backgroundColor: "#C8102E",
    marginBottom: 22,
    borderRadius: 3,
  },
  section: {
    marginBottom: 12,
    border: "1 solid #E6EAF0",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#F9FBFF",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0B5ED7",
    marginBottom: 6,
    borderBottom: "1 solid #E6EAF0",
    paddingBottom: 3,
  },
  bullet: {
    marginBottom: 3,
    lineHeight: 1.5,
    fontSize: 9.5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#EAF1FF",
    padding: 5,
    borderRadius: 4,
    marginBottom: 3,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottom: "1 solid #F0F0F0",
  },
  cell: {
    flex: 1,
    paddingRight: 4,
    fontSize: 8.5,
  },
  small: {
    fontSize: 8.5,
    color: "#4B5563",
    lineHeight: 1.4,
  },
  smallBold: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#0A2540",
  },
  twoCol: {
    flexDirection: "row",
    gap: 8,
  },
  col: {
    flex: 1,
  },
  chip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 700,
    marginRight: 4,
    marginBottom: 3,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
});

// Group node colors for the visual mind map
const GROUP_COLORS: Record<string, string> = {
  center: "#C8102E",
  entry: "#0B5ED7",
  intent: "#7C3AED",
  journey: "#059669",
  qualification: "#D97706",
  mode: "#0D9488",
  knowledge: "#4F46E5",
  action: "#EA580C",
  guardrail: "#DC2626",
  analytics: "#BE185D",
  handoff: "#10B981",
  readiness: "#64748B",
};

function PdfMindMapSvg({ project }: { project: ApexProject }) {
  const W = 510;
  const H = 200;

  // Horizontal main path nodes (left to right)
  const nodes = [
    { cx: 55, cy: 80, r: 28, label: "Lead Def.", color: "#C8102E" },
    { cx: 155, cy: 80, r: 28, label: "Intent", color: "#0B5ED7" },
    { cx: 255, cy: 80, r: 28, label: "Journey", color: "#0B5ED7" },
    { cx: 355, cy: 80, r: 28, label: "Qualify", color: "#22C55E" },
    { cx: 455, cy: 80, r: 28, label: "Handoff", color: "#22C55E" },
  ];

  // Conversation steps branching down from Journey node
  const steps = [
    { cx: 195, cy: 155, label: "Capture intent" },
    { cx: 255, cy: 155, label: "Capture details" },
    { cx: 315, cy: 155, label: "Capture phone" },
  ];

  // Use project data for dynamic label on first node
  void project;

  return (
    <Svg width={W} height={H}>
      {/* Horizontal connecting lines between main nodes */}
      {nodes.slice(0, -1).map((n, i) => (
        <Line
          key={`edge-${i}`}
          x1={n.cx + n.r}
          y1={n.cy}
          x2={nodes[i + 1].cx - nodes[i + 1].r}
          y2={nodes[i + 1].cy}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />
      ))}

      {/* Lines from Journey node down to sub-steps */}
      {steps.map((s, i) => (
        <Line
          key={`sub-edge-${i}`}
          x1={255}
          y1={80 + 28}
          x2={s.cx}
          y2={s.cy - 14}
          stroke="#CBD5E1"
          strokeWidth={1}
        />
      ))}

      {/* Main nodes */}
      {nodes.map((n) => (
        <G key={n.label}>
          <Circle cx={n.cx} cy={n.cy} r={n.r} fill={n.color} />
          <Text
            x={n.cx}
            y={n.cy + 3}
            style={{
              fill: "white",
              fontSize: 8,
              fontWeight: 700,
              textAnchor: "middle",
            }}
          >
            {n.label}
          </Text>
        </G>
      ))}

      {/* Sub-step nodes */}
      {steps.map((s) => (
        <G key={s.label}>
          <Circle cx={s.cx} cy={s.cy} r={14} fill="#E2E8F0" />
          <Text
            x={s.cx}
            y={s.cy + 3}
            style={{
              fill: "#0A2540",
              fontSize: 6,
              textAnchor: "middle",
            }}
          >
            {s.label}
          </Text>
        </G>
      ))}
    </Svg>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function GroupBadge({ label, color }: { label: string; color: string }) {
  return (
    <Text style={[styles.chip, { backgroundColor: color + "22", color }]}>
      {label}
    </Text>
  );
}

export function ApexPdfDocument({ project }: { project: ApexProject }) {
  const primaryMode = project.experienceModes.find((m) => m.id === project.selectedPrimaryMode);

  return (
    <Document>
      {/* ── PAGE 1: Cover + Executive Summary + Mind Map ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.redBar} />
        <Text style={styles.coverTitle}>APEX AI Conversion Journey Map</Text>
        <Text style={styles.coverSubtitle}>Prepared by APEX Studio · Engati</Text>
        <Text style={styles.coverSubtitle}>Client: {project.client}</Text>
        <Text style={styles.coverSubtitle}>Industry: {project.industry}</Text>
        <Text style={styles.coverSubtitle}>Business goal: {project.goal}</Text>
        <Text style={styles.coverSubtitle}>Primary mode: {primaryMode?.name ?? project.selectedPrimaryMode}</Text>
        <Text style={[styles.coverSubtitle, { marginBottom: 16 }]}>
          Date: {new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </Text>

        <Section title="Prototype note">
          <Text style={styles.bullet}>
            Analysis and integrations are simulated for demo purposes. Production deployment requires approved data sources,
            CRM/API credentials, WhatsApp Business templates, compliance review, and analytics instrumentation.
          </Text>
        </Section>

        <Section title="Executive summary">
          <Text style={styles.bullet}>APEX is recommended to convert {project.client} website intent into qualified, CRM-ready leads.</Text>
          <Text style={styles.bullet}>
            {project.selectedJourneys.length} journeys selected: {project.selectedJourneys.map((j) => j.name).join(", ")}.
          </Text>
          <Text style={styles.bullet}>
            Core scope ({project.selectedJourneys.length} journey{project.selectedJourneys.length !== 1 ? "s" : ""}): {project.implementationBrief.phase1Scope.slice(0, 3).join(", ")}.
          </Text>
          {primaryMode ? (
            <Text style={styles.bullet}>Primary mode: {primaryMode.name}. {primaryMode.bestFor}</Text>
          ) : (
            <Text style={styles.bullet}>Primary mode: APEX Overlay — AI-first guided conversion on existing site.</Text>
          )}
          <Text style={styles.bullet}>
            {project.analyticsEvents.length} analytics events planned across 5 funnel stages.
          </Text>
          <Text style={styles.bullet}>Recommended next step: {project.implementationBrief.recommendedNextStep}</Text>
        </Section>

        <Section title="Visual journey mind map">
          <Text style={[styles.small, { marginBottom: 6 }]}>
            Left-to-right flow: Lead Definition → Intent → Journey Entry → Qualification → Handoff, with conversation capture steps below.
          </Text>
          <PdfMindMapSvg project={project} />
          <View style={[styles.row, { marginTop: 8 }]}>
            {Object.entries(GROUP_COLORS).slice(0, 8).map(([group, color]) => (
              <GroupBadge key={group} label={group} color={color} />
            ))}
          </View>
        </Section>
      </Page>

      {/* ── PAGE 2: Journeys + Qualification ── */}
      <Page size="A4" style={styles.page}>
        <Section title="Recommended journeys">
          {project.selectedJourneys.map((journey) => (
            <View key={journey.id} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center", marginBottom: 3 }}>
                <Text style={styles.smallBold}>{journey.name}</Text>
                <Text style={[styles.chip, { backgroundColor: "#F0FFF4", color: "#059669" }]}>{journey.complexity}</Text>
              </View>
              <Text style={styles.small}>Intent: {journey.intent}</Text>
              <Text style={styles.small}>User problem: {journey.userProblem}</Text>
              <Text style={styles.small}>Business value: {journey.businessValue}</Text>
              <Text style={styles.small}>CRM event: {journey.crmEvent}  |  Suggested mode: {journey.suggestedMode}</Text>
              <Text style={styles.small}>Required fields: {journey.requiredFields.join(", ")}</Text>
              <Text style={styles.small}>Handoff: {journey.handoff.join(", ")}</Text>
            </View>
          ))}
        </Section>

        <Section title="Lead qualification logic">
          {project.qualificationRules.map((rule) => (
            <View key={rule.journeyId} style={{ marginBottom: 8 }}>
              <Text style={styles.smallBold}>{rule.journeyName}</Text>
              <Text style={styles.small}>Qualification threshold: {rule.qualifiedThreshold} points</Text>
              <Text style={styles.small}>Required fields: {rule.requiredFields.join(", ")}</Text>
              <Text style={styles.small}>CRM event: {rule.crmEvent}  |  Handoff: {rule.handoffDestinations.join(", ")}</Text>
              <Text style={styles.small}>Consent required: {rule.consentRequired ? "Yes" : "No"}</Text>
              <Text style={styles.small}>Fallback: {rule.fallbackRules[0]}</Text>
              <Text style={styles.small}>Human handoff triggers: {rule.humanHandoffTriggers.slice(0, 2).join(", ")}</Text>
            </View>
          ))}
        </Section>

        <Section title="Experience modes">
          {project.experienceModes.map((mode) => (
            <View key={mode.id} style={{ marginBottom: 5 }}>
              <Text style={styles.smallBold}>{mode.name}{mode.id === project.selectedPrimaryMode ? " (Primary)" : ""}</Text>
              <Text style={styles.small}>{mode.description}</Text>
              <Text style={styles.small}>Best for: {mode.bestFor}  |  Engineering effort: {mode.engineeringEffort}  |  Conversion value: {mode.conversionValue}</Text>
            </View>
          ))}
        </Section>

        <Section title="Knowledge, actions & guardrails">
          <Text style={styles.small}>Knowledge sources: {project.knowledgeSources.join(", ")}</Text>
          <Text style={[styles.small, { marginTop: 3 }]}>Actions: {project.actions.join(", ")}</Text>
          <Text style={[styles.small, { marginTop: 3 }]}>Guardrails ({project.guardrails.length}):</Text>
          {project.guardrails.slice(0, 5).map((g) => (
            <Text key={g.id} style={styles.bullet}>• {g.label}: {g.description}</Text>
          ))}
        </Section>
      </Page>

      {/* ── PAGE 3: Analytics + Integration + Implementation ── */}
      <Page size="A4" style={styles.page}>
        <Section title="Analytics event plan">
          <View style={styles.tableHeader}>
            {["Event name", "Group", "Trigger", "Priority"].map((h) => (
              <Text key={h} style={[styles.cell, { fontWeight: 700, fontSize: 8 }]}>{h}</Text>
            ))}
          </View>
          {project.analyticsEvents.map((event) => (
            <View key={event.id} style={styles.tableRow}>
              <Text style={styles.cell}>{event.name}</Text>
              <Text style={styles.cell}>{event.group}</Text>
              <Text style={styles.cell}>{event.trigger}</Text>
              <Text style={styles.cell}>{event.priority}</Text>
            </View>
          ))}
        </Section>

        <Section title="Integration plan">
          {project.integrations.map((intg) => (
            <View key={intg.id} style={{ marginBottom: 5 }}>
              <Text style={styles.smallBold}>{intg.name} — {intg.type}</Text>
              <Text style={styles.small}>Status: {intg.readinessStatus}  |  Complexity: {intg.complexity}</Text>
              <Text style={styles.small}>Data pushed: {intg.dataPushed.slice(0, 4).join(", ")}</Text>
              <Text style={styles.small}>Failure fallback: {intg.failureFallback}</Text>
              {intg.credentialsNeeded.length > 0 && (
                <Text style={styles.small}>Credentials needed: {intg.credentialsNeeded.join(", ")}</Text>
              )}
            </View>
          ))}
        </Section>

        <Section title="Implementation roadmap">
          <Text style={styles.small}>Business objective: {project.implementationBrief.businessObjective}</Text>
          <Text style={[styles.small, { marginTop: 4 }]}>Core scope:</Text>
          {project.implementationBrief.phase1Scope.map((item) => (
            <Text key={item} style={styles.bullet}>• {item}</Text>
          ))}
          <Text style={[styles.small, { marginTop: 4 }]}>Extended scope:</Text>
          {project.implementationBrief.phase2Scope.map((item) => (
            <Text key={item} style={styles.bullet}>• {item}</Text>
          ))}
          <Text style={[styles.small, { marginTop: 4 }]}>Recommended next step: {project.implementationBrief.recommendedNextStep}</Text>
        </Section>

        <Section title="Risk & dependency matrix">
          <View style={styles.tableHeader}>
            {["Risk", "Impact", "Owner", "Mitigation", "Status"].map((h) => (
              <Text key={h} style={[styles.cell, { fontWeight: 700, fontSize: 8 }]}>{h}</Text>
            ))}
          </View>
          {project.implementationBrief.riskMatrix.map((risk) => (
            <View key={risk.risk} style={styles.tableRow}>
              <Text style={styles.cell}>{risk.risk}</Text>
              <Text style={styles.cell}>{risk.impact}</Text>
              <Text style={styles.cell}>{risk.owner}</Text>
              <Text style={styles.cell}>{risk.mitigation}</Text>
              <Text style={styles.cell}>{risk.status}</Text>
            </View>
          ))}
        </Section>

        <Section title="Production readiness checklist">
          {project.productionReadiness.map((item) => (
            <View key={item.id} style={{ flexDirection: "row", gap: 6, marginBottom: 3 }}>
              <Text style={styles.small}>
                [{item.status === "Ready for demo" ? "x" : " "}] {item.label}
              </Text>
              <Text style={[styles.small, { color: "#9CA3AF" }]}>— {item.status}</Text>
            </View>
          ))}
        </Section>

        <Section title="Open questions">
          {project.implementationBrief.openQuestions.map((q) => (
            <Text key={q} style={styles.bullet}>• {q}</Text>
          ))}
          <Text style={[styles.smallBold, { marginTop: 8, color: "#C8102E" }]}>
            Final recommendation: Proceed with APEX Demo Build — all journeys configured and ready.
          </Text>
        </Section>
      </Page>
    </Document>
  );
}
