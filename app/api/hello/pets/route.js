let pets = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    status: "Available",
  },
];

// GET all pets
export async function GET() {
  return Response.json({ success: true, data: pets });
}

// POST add pet
export async function POST(req) {
  const body = await req.json();

  const newPet = {
    id: Date.now(),
    name: body.name,
    breed: body.breed,
    age: body.age,
    gender: body.gender,
    status: "Available",
  };

  pets.push(newPet);

  return Response.json({
    success: true,
    data: newPet,
    pets,
  });
}

// PUT update / adopt
export async function PUT(req) {
  const body = await req.json();

  const index = pets.findIndex((p) => p.id === body.id);

  if (index === -1) {
    return Response.json({ success: false, message: "Not found" });
  }

  pets[index] = { ...pets[index], ...body };

  return Response.json({
    success: true,
    data: pets[index],
    pets,
  });
}

// DELETE pet
export async function DELETE(req) {
  const { id } = await req.json();

  pets = pets.filter((p) => p.id !== id);

  return Response.json({
    success: true,
    pets,
  });
}