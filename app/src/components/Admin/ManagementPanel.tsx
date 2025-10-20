import SectionTile from "./SectionTile";

type ManagementPanelProps = {
  tiles: { title: string; content: React.ReactNode }[];
};

const ManagementPanel = ({ tiles }: ManagementPanelProps) => (
  <div className="flex flex-col gap-4 overflow-y-auto">
    {tiles.map((tile, idx) => (
      <SectionTile key={idx} title={tile.title}>
        {tile.content}
      </SectionTile>
    ))}
  </div>
);

export default ManagementPanel;
