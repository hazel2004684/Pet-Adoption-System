let pets = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    status: "Available",
  },
  {
    id: 2,
    name: "Mittens",
    breed: "Persian Cat",
    age: 2,
    gender: "Female",
    status: "Reserved",
  },
];

// GET - Fetch all pets
export async function GET() {
  return Response.json({
    success: true,
    data: pets,
  });
}

// POST - Add new pet
export async function POST(req) {
  const body = await req.json();

  const newPet = {
    id: Date.now(), // unique id
    name: body.name,
    breed: body.breed,
    age: body.age,
    gender: body.gender,
    status: body.status || "Available",
  };

  pets.push(newPet);

  return Response.json({
    success: true,
    message: "Pet added successfully",
    data: newPet,
  });
}

// PUT - Update pet (edit OR adopt OR status change)
export async function PUT(req) {
  const body = await req.json();

  const index = pets.findIndex((p) => p.id === body.id);

  if (index === -1) {
    return Response.json({
      success: false,
      message: "Pet not found",
    });
  }

  // update fields
  pets[index] = {
    ...pets[index],
    name: body.name ?? pets[index].name,
    breed: body.breed ?? pets[index].breed,
    age: body.age ?? pets[index].age,
    gender: body.gender ?? pets[index].gender,
    status: body.status ?? pets[index].status,
  };

  return Response.json({
    success: true,
    message: "Pet updated successfully",
    data: pets[index],
  });
}

// DELETE - Remove pet
export async function DELETE(req) {
  const body = await req.json();

  const index = pets.findIndex((p) => p.id === body.id);

  if (index === -1) {
    return Response.json({
      success: false,
      message: "Pet not found",
    });
  }

  const deletedPet = pets.splice(index, 1);

  return Response.json({
    success: true,
    message: "Pet deleted successfully",
    data: deletedPet[0],
  });
}